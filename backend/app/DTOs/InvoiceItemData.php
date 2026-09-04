<?php

namespace App\DTOs;

use App\Enums\DiscountType;

readonly class InvoiceItemData
{
    public function __construct(
        public string $description,
        public float $quantity,
        public string $unit,
        public float $unitPrice,
        public DiscountType $discountType,
        public float $discountValue,
        public ?int $taxId,
        public float $taxRate,
        public int $sortOrder = 0,
    ) {}

    public static function fromArray(array $data, int $sortOrder = 0): self
    {
        return new self(
            description: $data['description'],
            quantity: (float) $data['quantity'],
            unit: $data['unit'] ?? 'pcs',
            unitPrice: (float) $data['unit_price'],
            discountType: DiscountType::from($data['discount_type'] ?? 'percent'),
            discountValue: (float) ($data['discount_value'] ?? 0),
            taxId: $data['tax_id'] ?? null,
            taxRate: (float) ($data['tax_rate'] ?? 0),
            sortOrder: $data['sort_order'] ?? $sortOrder,
        );
    }
}
