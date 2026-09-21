/**
 * Mirrors the backend's App\Services\InvoiceCalculator formula for optimistic
 * live preview only. The backend recomputes and persists the authoritative
 * totals on save — this never needs to be byte-exact, just close enough for
 * a responsive UI.
 */
export type DiscountType = "percent" | "fixed";

export interface CalculableItem {
  quantity: number;
  unit_price: number;
  discount_type: DiscountType;
  discount_value: number;
  tax_rate: number;
}

export interface LineTotals {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

export interface InvoiceTotals {
  subtotal: number;
  discountTotal: number;
  shippingCost: number;
  taxTotal: number;
  grandTotal: number;
  lines: LineTotals[];
}

const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculateLine(item: CalculableItem): LineTotals {
  const subtotal = round2((item.quantity || 0) * (item.unit_price || 0));

  let discountAmount =
    item.discount_type === "percent"
      ? round2((subtotal * (item.discount_value || 0)) / 100)
      : round2(item.discount_value || 0);
  discountAmount = Math.min(discountAmount, subtotal);

  const taxableAmount = subtotal - discountAmount;
  const taxAmount = round2((taxableAmount * (item.tax_rate || 0)) / 100);
  const total = round2(taxableAmount + taxAmount);

  return { subtotal, discountAmount, taxAmount, total };
}

/**
 * @param shippingCost Flat invoice-level shipping cost (not per item).
 * @param shippingTaxRate VAT rate (%) applied to the shipping cost itself —
 *                        pass the default Tax's rate so shipping is taxed
 *                        the same way the backend taxes it.
 */
export function calculateInvoice(
  items: CalculableItem[],
  shippingCost = 0,
  shippingTaxRate = 0,
): InvoiceTotals {
  const lines = items.map(calculateLine);

  const itemsTaxTotal = round2(lines.reduce((sum, l) => sum + l.taxAmount, 0));
  const itemsGrandTotal = round2(lines.reduce((sum, l) => sum + l.total, 0));

  const shipping = round2(Math.max(0, shippingCost || 0));
  const shippingTax = round2((shipping * (shippingTaxRate || 0)) / 100);

  return {
    subtotal: round2(lines.reduce((sum, l) => sum + l.subtotal, 0)),
    discountTotal: round2(lines.reduce((sum, l) => sum + l.discountAmount, 0)),
    shippingCost: shipping,
    taxTotal: round2(itemsTaxTotal + shippingTax),
    grandTotal: round2(itemsGrandTotal + shipping + shippingTax),
    lines,
  };
}
