import type { Company, Invoice } from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";
import { formatDate, formatMoney } from "@/lib/utils/format";

const LOGO_HEIGHT: Record<string, string> = {
  small: "h-8",
  medium: "h-12",
  large: "h-16",
};

const LOGO_JUSTIFY: Record<string, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

/**
 * Splits an item description into its first line (the item's "title") and
 * everything after it, so the title can render bold/dark and the rest
 * render lighter — matching both the downloaded PDF (invoice-generator.com
 * renders it this way) and the description field's own styling on the
 * invoice creation form.
 */
function splitDescription(description: string): { title: string; rest: string } {
  const firstNewline = description.indexOf("\n");

  return firstNewline === -1
    ? { title: description, rest: "" }
    : { title: description.slice(0, firstNewline), rest: description.slice(firstNewline + 1) };
}

export function InvoicePrintPreview({ invoice, company }: { invoice: Invoice; company?: Company }) {
  const symbol = invoice.currency.symbol;

  // Mirrors the backend's InvoiceGeneratorService::buildPayload() exactly,
  // so the "Notes" block here shows the same text the downloaded/emailed
  // PDF shows — company bank details folded in under the invoice's own
  // notes, since invoice-generator.com has no separate field for them.
  const bankDetails = company?.payment_instructions ? `BANK DETAILS:\n${company.payment_instructions}` : null;
  const notes = [invoice.notes, bankDetails].filter(Boolean).join("\n\n");

  return (
    <div
      id="invoice-print-area"
      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-8 text-[#14161f] shadow-sm print:border-0 print:shadow-none print:p-0"
    >
      <div className="flex items-start justify-between gap-6">
        <div className={cn("flex flex-1", LOGO_JUSTIFY[company?.logo_position ?? "left"])}>
          {company?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- server-hosted branding asset
            <img
              src={company.logo_url}
              alt={company.name}
              className={cn(LOGO_HEIGHT[company.logo_size] ?? LOGO_HEIGHT.medium, "w-auto object-contain")}
            />
          ) : (
            <p className="text-lg font-bold">{company?.name ?? "AIO Technologies"}</p>
          )}
        </div>
        <h1 className="shrink-0 text-3xl font-bold tracking-wide text-gray-700">INVOICE</h1>
      </div>

      <div className="mt-6 flex items-start justify-between gap-6 border-b border-gray-200 pb-6">
        <div className="space-y-0.5 text-sm">
          {company?.name && <p className="font-bold">{company.name}</p>}
          {company?.address && <p className="text-gray-600">{company.address}</p>}
          {company?.phone && <p className="text-gray-600">{company.phone}</p>}
          {company?.email && <p className="text-gray-600">{company.email}</p>}
          {company?.tin && <p className="text-gray-600">TIN: {company.tin}</p>}
          {company?.vrn && <p className="text-gray-600">VRN: {company.vrn}</p>}
        </div>
        <div className="shrink-0 text-right">
          <div className="flex justify-between gap-8 text-xs text-gray-500">
            <span>Date:</span>
            <span className="font-medium text-[#14161f]">{formatDate(invoice.invoice_date)}</span>
          </div>
          {invoice.due_date && (
            <div className="mt-1 flex justify-between gap-8 text-xs text-gray-500">
              <span>Due:</span>
              <span className="font-medium text-[#14161f]">{formatDate(invoice.due_date)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between gap-8 rounded-[4px] bg-gray-100 px-3 py-2 text-sm">
            <span className="font-semibold">Balance Due:</span>
            <span className="font-bold">{formatMoney(invoice.outstanding_balance, symbol)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs text-gray-400">Bill To:</p>
          <p className="mt-1 font-bold">{invoice.customer.company_name}</p>
          {invoice.customer.contact_person && <p className="text-sm text-gray-600">{invoice.customer.contact_person}</p>}
          {invoice.customer.physical_address && <p className="text-sm text-gray-600">{invoice.customer.physical_address}</p>}
          {invoice.customer.phone && <p className="text-sm text-gray-600">{invoice.customer.phone}</p>}
          {invoice.customer.tin && <p className="text-sm text-gray-600">TIN: {invoice.customer.tin}</p>}
        </div>
        {invoice.reference && (
          <div className="text-right">
            <p className="text-xs text-gray-400">Reference</p>
            <p className="mt-1 text-sm text-gray-600">{invoice.reference}</p>
          </div>
        )}
      </div>

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="bg-gray-800 text-xs uppercase text-white">
            <th className="rounded-l-[4px] py-2.5 px-3 font-medium">Item</th>
            <th className="py-2.5 px-3 text-right font-medium">Quantity</th>
            <th className="py-2.5 px-3 text-right font-medium">Rate</th>
            <th className="rounded-r-[4px] py-2.5 px-3 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => {
            const { title, rest } = splitDescription(item.description);

            return (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-2.5 px-3">
                  <p className="font-semibold text-[#14161f]">{title}</p>
                  {rest && <p className="whitespace-pre-line text-gray-400">{rest}</p>}
                </td>
                <td className="py-2.5 px-3 text-right">{item.quantity}</td>
                <td className="py-2.5 px-3 text-right">{formatMoney(item.unit_price, symbol)}</td>
                <td className="py-2.5 px-3 text-right font-medium">{formatMoney(item.total, symbol)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <div className="w-64 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatMoney(invoice.subtotal, symbol)}</span>
          </div>
          {invoice.discount_total > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Discount</span>
              <span>−{formatMoney(invoice.discount_total, symbol)}</span>
            </div>
          )}
          {invoice.shipping_cost > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{formatMoney(invoice.shipping_cost, symbol)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>VAT</span>
            <span>{formatMoney(invoice.tax_total, symbol)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-1.5 text-base font-bold">
            <span>Total</span>
            <span>{formatMoney(invoice.grand_total, symbol)}</span>
          </div>
          {invoice.amount_paid > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Paid</span>
              <span>{formatMoney(invoice.amount_paid, symbol)}</span>
            </div>
          )}
        </div>
      </div>

      {(notes || invoice.terms) && (
        <div className="mt-8 grid grid-cols-2 gap-6 border-t border-gray-200 pt-4 text-xs text-gray-500">
          {notes && (
            <div>
              <p className="font-semibold uppercase text-gray-400">Notes</p>
              <p className="mt-1 whitespace-pre-line">{notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <p className="font-semibold uppercase text-gray-400">Terms</p>
              <p className="mt-1 whitespace-pre-line">{invoice.terms}</p>
            </div>
          )}
        </div>
      )}

      {company?.stamp_enabled && company.stamp_url && (
        <div className="mt-10 flex items-end justify-end gap-8 border-t border-gray-100 pt-6">
          {/* eslint-disable-next-line @next/next/no-img-element -- server-hosted branding asset */}
          <img
            src={company.stamp_url}
            alt="Company stamp"
            style={{
              width: company.stamp_width,
              transform: `rotate(${company.stamp_rotation}deg)`,
              opacity: company.stamp_opacity / 100,
            }}
            className="object-contain"
          />
        </div>
      )}
    </div>
  );
}
