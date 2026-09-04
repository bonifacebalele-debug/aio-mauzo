<?php

namespace App\Services;

use App\DTOs\InvoiceItemData;
use App\Enums\DiscountType;

/**
 * Pure calculation logic for invoice line items and totals.
 * This is the single source of truth for money math — the frontend
 * mirrors this formula only for optimistic live preview.
 */
final class InvoiceCalculator
{
    /**
     * @return array{subtotal: float, discount_amount: float, tax_amount: float, total: float}
     */
    public static function lineItem(InvoiceItemData|array $item): array
    {
        [$quantity, $unitPrice, $discountType, $discountValue, $taxRate] = is_array($item)
            ? [
                (float) $item['quantity'],
                (float) $item['unit_price'],
                DiscountType::from($item['discount_type'] ?? 'percent'),
                (float) ($item['discount_value'] ?? 0),
                (float) ($item['tax_rate'] ?? 0),
            ]
            : [$item->quantity, $item->unitPrice, $item->discountType, $item->discountValue, $item->taxRate];

        $subtotal = round($quantity * $unitPrice, 2);

        $discountAmount = $discountType === DiscountType::Percent
            ? round($subtotal * $discountValue / 100, 2)
            : round($discountValue, 2);
        $discountAmount = min($discountAmount, $subtotal);

        $taxableAmount = $subtotal - $discountAmount;
        $taxAmount = round($taxableAmount * $taxRate / 100, 2);

        $total = round($taxableAmount + $taxAmount, 2);

        return [
            'subtotal' => $subtotal,
            'discount_amount' => $discountAmount,
            'tax_amount' => $taxAmount,
            'total' => $total,
        ];
    }

    /**
     * @param  InvoiceItemData[]  $items
     * @return array{subtotal: float, discount_total: float, tax_total: float, grand_total: float, lines: array}
     */
    public static function invoice(array $items): array
    {
        $subtotal = 0.0;
        $discountTotal = 0.0;
        $taxTotal = 0.0;
        $grandTotal = 0.0;
        $lines = [];

        foreach ($items as $item) {
            $line = self::lineItem($item);
            $subtotal += $line['subtotal'];
            $discountTotal += $line['discount_amount'];
            $taxTotal += $line['tax_amount'];
            $grandTotal += $line['total'];
            $lines[] = $line;
        }

        return [
            'subtotal' => round($subtotal, 2),
            'discount_total' => round($discountTotal, 2),
            'tax_total' => round($taxTotal, 2),
            'grand_total' => round($grandTotal, 2),
            'lines' => $lines,
        ];
    }
}
