<?php

namespace App\Services;

use App\DTOs\InvoiceData;
use App\Enums\InvoiceStatus;
use App\Models\Company;
use App\Models\Invoice;
use App\Models\InvoiceHistory;
use App\Models\User;
use App\Repositories\Contracts\InvoiceRepositoryInterface;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class InvoiceService
{
    /**
     * Status transitions that are allowed to be made manually via the API.
     * (overdue is derived automatically from due_date and is not a manual target).
     */
    private const array ALLOWED_TRANSITIONS = [
        'draft' => ['sent', 'cancelled'],
        'sent' => ['viewed', 'paid', 'cancelled'],
        'viewed' => ['paid', 'cancelled'],
        'overdue' => ['paid', 'cancelled'],
        'paid' => [],
        'cancelled' => [],
    ];

    public function __construct(
        private readonly InvoiceRepositoryInterface $invoices,
        private readonly ActivityLogger $activityLogger,
    ) {}

    public function list(array $filters, int $perPage)
    {
        return $this->invoices->paginate($filters, $perPage);
    }

    public function find(int $id): Invoice
    {
        return $this->invoices->findOrFail($id);
    }

    public function create(InvoiceData $data, User $actor): Invoice
    {
        return DB::transaction(function () use ($data, $actor) {
            $company = Company::query()->firstOrFail();
            $totals = InvoiceCalculator::invoice($data->items);

            $invoice = $this->invoices->create([
                'company_id' => $company->id,
                'customer_id' => $data->customerId,
                'currency_id' => $data->currencyId,
                'invoice_number' => $this->invoices->nextInvoiceNumber(),
                'reference' => $data->reference,
                'invoice_date' => $data->invoiceDate,
                'due_date' => $data->dueDate,
                'status' => InvoiceStatus::Draft,
                'subtotal' => $totals['subtotal'],
                'discount_total' => $totals['discount_total'],
                'tax_total' => $totals['tax_total'],
                'grand_total' => $totals['grand_total'],
                'notes' => $data->notes,
                'terms' => $data->terms,
                'prepared_by' => $data->preparedBy ?? $actor->id,
                'approved_by' => $data->approvedBy,
                'created_by' => $actor->id,
            ]);

            $this->syncItems($invoice, $data, $totals['lines']);

            $this->recordHistory($invoice, $actor, 'created', description: "Invoice {$invoice->invoice_number} created");

            return $invoice->fresh(['items', 'customer', 'currency']);
        });
    }

    public function update(Invoice $invoice, InvoiceData $data, User $actor): Invoice
    {
        return DB::transaction(function () use ($invoice, $data, $actor) {
            $totals = InvoiceCalculator::invoice($data->items);

            $this->invoices->update($invoice, [
                'customer_id' => $data->customerId,
                'currency_id' => $data->currencyId,
                'reference' => $data->reference,
                'invoice_date' => $data->invoiceDate,
                'due_date' => $data->dueDate,
                'subtotal' => $totals['subtotal'],
                'discount_total' => $totals['discount_total'],
                'tax_total' => $totals['tax_total'],
                'grand_total' => $totals['grand_total'],
                'notes' => $data->notes,
                'terms' => $data->terms,
                'prepared_by' => $data->preparedBy,
                'approved_by' => $data->approvedBy,
            ]);

            $invoice->items()->delete();
            $this->syncItems($invoice, $data, $totals['lines']);

            $this->recordHistory($invoice, $actor, 'updated', description: "Invoice {$invoice->invoice_number} updated");

            return $invoice->fresh(['items', 'customer', 'currency']);
        });
    }

    public function updateStatus(Invoice $invoice, InvoiceStatus $newStatus, User $actor): Invoice
    {
        $current = $invoice->status;
        $allowed = self::ALLOWED_TRANSITIONS[$current->value] ?? [];

        if (! in_array($newStatus->value, $allowed, true)) {
            throw new InvalidArgumentException("Cannot transition invoice from \"{$current->value}\" to \"{$newStatus->value}\".");
        }

        $timestampField = match ($newStatus) {
            InvoiceStatus::Sent => 'sent_at',
            InvoiceStatus::Viewed => 'viewed_at',
            InvoiceStatus::Paid => 'paid_at',
            InvoiceStatus::Cancelled => 'cancelled_at',
            default => null,
        };

        $update = ['status' => $newStatus];
        if ($timestampField) {
            $update[$timestampField] = now();
        }

        $invoice = $this->invoices->update($invoice, $update);

        $this->recordHistory(
            $invoice,
            $actor,
            'status_changed',
            oldValue: $current->value,
            newValue: $newStatus->value,
            description: "Status changed from {$current->label()} to {$newStatus->label()}",
        );

        return $invoice;
    }

    public function duplicate(Invoice $source, User $actor): Invoice
    {
        return DB::transaction(function () use ($source, $actor) {
            $company = Company::query()->firstOrFail();

            $duplicate = $this->invoices->create([
                'company_id' => $source->company_id,
                'customer_id' => $source->customer_id,
                'currency_id' => $source->currency_id,
                'invoice_number' => $this->invoices->nextInvoiceNumber(),
                'reference' => $source->reference,
                'invoice_date' => now()->toDateString(),
                'due_date' => $source->due_date,
                'status' => InvoiceStatus::Draft,
                'subtotal' => $source->subtotal,
                'discount_total' => $source->discount_total,
                'tax_total' => $source->tax_total,
                'grand_total' => $source->grand_total,
                'notes' => $source->notes,
                'terms' => $source->terms,
                'prepared_by' => $actor->id,
                'created_by' => $actor->id,
                'duplicated_from' => $source->id,
            ]);

            foreach ($source->items as $item) {
                $duplicate->items()->create([
                    'tax_id' => $item->tax_id,
                    'description' => $item->description,
                    'quantity' => $item->quantity,
                    'unit' => $item->unit,
                    'unit_price' => $item->unit_price,
                    'discount_type' => $item->discount_type,
                    'discount_value' => $item->discount_value,
                    'tax_rate' => $item->tax_rate,
                    'subtotal' => $item->subtotal,
                    'discount_amount' => $item->discount_amount,
                    'tax_amount' => $item->tax_amount,
                    'total' => $item->total,
                    'sort_order' => $item->sort_order,
                ]);
            }

            $this->recordHistory($duplicate, $actor, 'duplicated', description: "Duplicated from invoice {$source->invoice_number}");

            return $duplicate->fresh(['items', 'customer', 'currency']);
        });
    }

    public function delete(Invoice $invoice, User $actor): void
    {
        $number = $invoice->invoice_number;
        $this->invoices->delete($invoice);

        $this->activityLogger->log($actor, 'invoice.deleted', $invoice, "Deleted invoice {$number}");
    }

    /**
     * @param  array  $calculatedLines  Parallel array to $data->items, produced by InvoiceCalculator::invoice()
     */
    private function syncItems(Invoice $invoice, InvoiceData $data, array $calculatedLines): void
    {
        foreach ($data->items as $index => $item) {
            $line = $calculatedLines[$index];

            $invoice->items()->create([
                'tax_id' => $item->taxId,
                'description' => $item->description,
                'quantity' => $item->quantity,
                'unit' => $item->unit,
                'unit_price' => $item->unitPrice,
                'discount_type' => $item->discountType,
                'discount_value' => $item->discountValue,
                'tax_rate' => $item->taxRate,
                'subtotal' => $line['subtotal'],
                'discount_amount' => $line['discount_amount'],
                'tax_amount' => $line['tax_amount'],
                'total' => $line['total'],
                'sort_order' => $item->sortOrder,
            ]);
        }
    }

    private function recordHistory(
        Invoice $invoice,
        User $actor,
        string $action,
        ?string $oldValue = null,
        ?string $newValue = null,
        ?string $description = null,
    ): InvoiceHistory {
        return $invoice->history()->create([
            'action' => $action,
            'old_value' => $oldValue,
            'new_value' => $newValue,
            'description' => $description,
            'user_id' => $actor->id,
        ]);
    }
}
