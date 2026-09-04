<?php

namespace Tests\Unit;

use App\DTOs\InvoiceItemData;
use App\Enums\DiscountType;
use App\Services\InvoiceCalculator;
use PHPUnit\Framework\TestCase;

class InvoiceCalculatorTest extends TestCase
{
    public function test_line_item_with_percent_discount_and_tax(): void
    {
        $item = new InvoiceItemData(
            description: 'Consulting',
            quantity: 2,
            unit: 'hrs',
            unitPrice: 100.0,
            discountType: DiscountType::Percent,
            discountValue: 10, // 10%
            taxId: null,
            taxRate: 18, // 18% VAT
        );

        $line = InvoiceCalculator::lineItem($item);

        // subtotal = 2 * 100 = 200
        $this->assertSame(200.0, $line['subtotal']);
        // discount = 10% of 200 = 20
        $this->assertSame(20.0, $line['discount_amount']);
        // taxable = 180, tax = 18% of 180 = 32.4
        $this->assertSame(32.4, $line['tax_amount']);
        // total = 180 + 32.4 = 212.4
        $this->assertSame(212.4, $line['total']);
    }

    public function test_line_item_with_fixed_discount_capped_at_subtotal(): void
    {
        $item = new InvoiceItemData(
            description: 'Small item',
            quantity: 1,
            unit: 'pcs',
            unitPrice: 10.0,
            discountType: DiscountType::Fixed,
            discountValue: 999, // deliberately larger than subtotal
            taxId: null,
            taxRate: 0,
        );

        $line = InvoiceCalculator::lineItem($item);

        $this->assertSame(10.0, $line['subtotal']);
        // discount cannot exceed subtotal
        $this->assertSame(10.0, $line['discount_amount']);
        $this->assertSame(0.0, $line['tax_amount']);
        $this->assertSame(0.0, $line['total']);
    }

    public function test_line_item_with_no_discount_or_tax(): void
    {
        $item = new InvoiceItemData(
            description: 'Plain item',
            quantity: 3,
            unit: 'pcs',
            unitPrice: 15.5,
            discountType: DiscountType::Percent,
            discountValue: 0,
            taxId: null,
            taxRate: 0,
        );

        $line = InvoiceCalculator::lineItem($item);

        $this->assertSame(46.5, $line['subtotal']);
        $this->assertSame(0.0, $line['discount_amount']);
        $this->assertSame(0.0, $line['tax_amount']);
        $this->assertSame(46.5, $line['total']);
    }

    public function test_invoice_totals_aggregate_across_multiple_lines(): void
    {
        $items = [
            new InvoiceItemData('Item A', 1, 'pcs', 100.0, DiscountType::Percent, 0, null, 18),
            new InvoiceItemData('Item B', 2, 'pcs', 50.0, DiscountType::Fixed, 10, null, 18),
        ];

        $totals = InvoiceCalculator::invoice($items);

        // Item A: subtotal 100, discount 0, taxable 100, tax 18 -> total 118
        // Item B: subtotal 100, discount 10, taxable 90, tax 16.2 -> total 106.2
        $this->assertSame(200.0, $totals['subtotal']);
        $this->assertSame(10.0, $totals['discount_total']);
        $this->assertSame(34.2, $totals['tax_total']);
        $this->assertSame(224.2, $totals['grand_total']);
        $this->assertCount(2, $totals['lines']);
    }
}
