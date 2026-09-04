<?php

namespace App\Repositories\Contracts;

use App\Models\Invoice;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface InvoiceRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function find(int $id): ?Invoice;

    public function findOrFail(int $id): Invoice;

    public function create(array $data): Invoice;

    public function update(Invoice $invoice, array $data): Invoice;

    public function delete(Invoice $invoice): bool;

    public function nextInvoiceNumber(): string;
}
