<?php

namespace App\DTOs;

readonly class InvoiceData
{
    /** @param InvoiceItemData[] $items */
    public function __construct(
        public int $customerId,
        public int $currencyId,
        public ?string $reference,
        public string $invoiceDate,
        public ?string $dueDate,
        public ?string $notes,
        public ?string $terms,
        public ?int $preparedBy,
        public ?int $approvedBy,
        public array $items,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            customerId: (int) $data['customer_id'],
            currencyId: (int) $data['currency_id'],
            reference: $data['reference'] ?? null,
            invoiceDate: $data['invoice_date'],
            dueDate: $data['due_date'] ?? null,
            notes: $data['notes'] ?? null,
            terms: $data['terms'] ?? null,
            preparedBy: $data['prepared_by'] ?? null,
            approvedBy: $data['approved_by'] ?? null,
            items: array_map(
                fn (array $item, int $index) => InvoiceItemData::fromArray($item, $index),
                $data['items'],
                array_keys($data['items']),
            ),
        );
    }
}
