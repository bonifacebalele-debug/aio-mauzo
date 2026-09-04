<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * Produces the tabular datasets behind every report screen and export.
 * Each method returns a plain array/Collection shape that both the JSON
 * API and the PDF/CSV/Excel exporters consume identically, so the numbers
 * on screen always match the numbers in the export.
 */
class ReportService
{
    public function salesReport(?string $from, ?string $to): Collection
    {
        return $this->invoicesInRange($from, $to)
            ->get()
            ->map(fn (Invoice $invoice) => [
                'invoice_number' => $invoice->invoice_number,
                'date' => $invoice->invoice_date->toDateString(),
                'customer' => $invoice->customer->company_name,
                'status' => $invoice->status->value,
                'subtotal' => (float) $invoice->subtotal,
                'discount' => (float) $invoice->discount_total,
                'tax' => (float) $invoice->tax_total,
                'grand_total' => (float) $invoice->grand_total,
            ]);
    }

    public function vatReport(?string $from, ?string $to): Collection
    {
        return $this->invoicesInRange($from, $to)
            ->with('items.tax')
            ->get()
            ->flatMap(fn (Invoice $invoice) => $invoice->items->map(fn ($item) => [
                'invoice_number' => $invoice->invoice_number,
                'date' => $invoice->invoice_date->toDateString(),
                'customer' => $invoice->customer->company_name,
                'description' => $item->description,
                'taxable_amount' => (float) ($item->subtotal - $item->discount_amount),
                'tax_rate' => (float) $item->tax_rate,
                'tax_amount' => (float) $item->tax_amount,
            ]))
            ->values();
    }

    public function customerReport(?string $from, ?string $to): Collection
    {
        return $this->invoicesInRange($from, $to)
            ->select('customer_id')
            ->selectRaw('COUNT(*) as invoice_count')
            ->selectRaw('SUM(grand_total) as total_invoiced')
            ->selectRaw('SUM(amount_paid) as total_paid')
            ->selectRaw('SUM(grand_total - amount_paid) as outstanding')
            ->groupBy('customer_id')
            ->with('customer:id,company_name')
            ->get()
            ->map(fn ($row) => [
                'customer' => $row->customer->company_name,
                'invoice_count' => (int) $row->invoice_count,
                'total_invoiced' => (float) $row->total_invoiced,
                'total_paid' => (float) $row->total_paid,
                'outstanding' => (float) $row->outstanding,
            ]);
    }

    public function outstandingReport(): Collection
    {
        return Invoice::query()
            ->whereNotIn('status', [InvoiceStatus::Paid->value, InvoiceStatus::Cancelled->value])
            ->with('customer:id,company_name')
            ->orderBy('due_date')
            ->get()
            ->map(fn (Invoice $invoice) => [
                'invoice_number' => $invoice->invoice_number,
                'customer' => $invoice->customer->company_name,
                'invoice_date' => $invoice->invoice_date->toDateString(),
                'due_date' => $invoice->due_date?->toDateString(),
                'status' => $invoice->status->value,
                'grand_total' => (float) $invoice->grand_total,
                'amount_paid' => (float) $invoice->amount_paid,
                'outstanding' => (float) $invoice->outstandingBalance(),
                'days_overdue' => $invoice->due_date && $invoice->due_date->isPast()
                    ? (int) $invoice->due_date->diffInDays(now())
                    : 0,
            ]);
    }

    public function paymentReport(?string $from, ?string $to): Collection
    {
        $query = Payment::query()->with(['invoice:id,invoice_number,customer_id', 'invoice.customer:id,company_name']);

        if ($from) {
            $query->whereDate('payment_date', '>=', $from);
        }
        if ($to) {
            $query->whereDate('payment_date', '<=', $to);
        }

        return $query->orderByDesc('payment_date')
            ->get()
            ->map(fn (Payment $payment) => [
                'payment_date' => $payment->payment_date->toDateString(),
                'invoice_number' => $payment->invoice?->invoice_number,
                'customer' => $payment->invoice?->customer?->company_name,
                'amount' => (float) $payment->amount,
                'payment_method' => $payment->payment_method,
                'reference' => $payment->reference,
            ]);
    }

    public function periodSummary(string $period, int $year): Collection
    {
        $dateFormat = $period === 'monthly' ? '%Y-%m' : '%Y';

        return Invoice::query()
            ->selectRaw("DATE_FORMAT(invoice_date, '{$dateFormat}') as period")
            ->selectRaw('COUNT(*) as invoice_count')
            ->selectRaw('SUM(grand_total) as total_invoiced')
            ->selectRaw('SUM(CASE WHEN status = ? THEN grand_total ELSE 0 END) as total_paid', [InvoiceStatus::Paid->value])
            ->whereYear('invoice_date', $year)
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->map(fn ($row) => [
                'period' => $row->period,
                'invoice_count' => (int) $row->invoice_count,
                'total_invoiced' => (float) $row->total_invoiced,
                'total_paid' => (float) $row->total_paid,
            ]);
    }

    private function invoicesInRange(?string $from, ?string $to): Builder
    {
        $query = Invoice::query()->with('customer:id,company_name');

        if ($from) {
            $query->whereDate('invoice_date', '>=', Carbon::parse($from));
        }
        if ($to) {
            $query->whereDate('invoice_date', '<=', Carbon::parse($to));
        }

        return $query;
    }
}
