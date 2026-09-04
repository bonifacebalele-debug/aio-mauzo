<?php

namespace App\Repositories\Eloquent;

use App\Models\Company;
use App\Models\Invoice;
use App\Repositories\Contracts\InvoiceRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class InvoiceRepository implements InvoiceRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Invoice::query()->with(['customer:id,company_name', 'currency:id,code,symbol']);

        if (! empty($filters['search'])) {
            $term = $filters['search'];
            $query->where(function ($q) use ($term) {
                $q->where('invoice_number', 'like', "%{$term}%")
                    ->orWhere('reference', 'like', "%{$term}%")
                    ->orWhereHas('customer', function ($cq) use ($term) {
                        $cq->where('company_name', 'like', "%{$term}%")
                            ->orWhere('phone', 'like', "%{$term}%")
                            ->orWhere('tin', 'like', "%{$term}%");
                    });
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        if (! empty($filters['date_from'])) {
            $query->whereDate('invoice_date', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->whereDate('invoice_date', '<=', $filters['date_to']);
        }

        return $query->orderByDesc('id')->paginate($perPage);
    }

    public function find(int $id): ?Invoice
    {
        return Invoice::with(['items', 'customer', 'currency', 'payments'])->find($id);
    }

    public function findOrFail(int $id): Invoice
    {
        return Invoice::with(['items', 'customer', 'currency', 'payments'])->findOrFail($id);
    }

    public function create(array $data): Invoice
    {
        return Invoice::create($data);
    }

    public function update(Invoice $invoice, array $data): Invoice
    {
        $invoice->update($data);

        return $invoice->fresh(['items', 'customer', 'currency']);
    }

    public function delete(Invoice $invoice): bool
    {
        return (bool) $invoice->delete();
    }

    public function nextInvoiceNumber(): string
    {
        return DB::transaction(function () {
            /** @var Company $company */
            $company = Company::query()->lockForUpdate()->firstOrFail();

            $number = $company->next_invoice_number;
            $company->increment('next_invoice_number');

            return strtr($company->invoice_number_format, [
                '{PREFIX}' => $company->invoice_prefix,
                '{YEAR}' => now()->format('Y'),
                '{NUMBER}' => str_pad((string) $number, 4, '0', STR_PAD_LEFT),
            ]);
        });
    }
}
