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

export function InvoicePrintPreview({ invoice, company }: { invoice: Invoice; company?: Company }) {
  const symbol = invoice.currency.symbol;

  return (
    <div
      id="invoice-print-area"
      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-8 text-[#14161f] shadow-sm print:border-0 print:shadow-none print:p-0"
    >
      <div className="flex items-start justify-between border-b border-gray-200 pb-6">
        <div className={cn("flex flex-1", LOGO_JUSTIFY[company?.logo_position ?? "left"])}>
          {company?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- server-hosted branding asset
            <img
              src={company.logo_url}
              alt={company.name}
              className={cn(LOGO_HEIGHT[company.logo_size] ?? LOGO_HEIGHT.medium, "w-auto object-contain")}
            />
          ) : (
            <div>
              <p className="text-lg font-bold">{company?.name ?? "AIO Technologies"}</p>
              <p className="text-xs text-gray-500">Invoice</p>
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-xl font-bold tracking-tight">{invoice.invoice_number}</p>
          <p className="text-xs text-gray-500">Date: {formatDate(invoice.invoice_date)}</p>
          {invoice.due_date && <p className="text-xs text-gray-500">Due: {formatDate(invoice.due_date)}</p>}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold uppercase text-gray-400">Bill To</p>
          <p className="mt-1 font-medium">{invoice.customer.company_name}</p>
          {invoice.customer.contact_person && <p className="text-sm text-gray-600">{invoice.customer.contact_person}</p>}
          {invoice.customer.physical_address && <p className="text-sm text-gray-600">{invoice.customer.physical_address}</p>}
          {invoice.customer.phone && <p className="text-sm text-gray-600">{invoice.customer.phone}</p>}
          {invoice.customer.tin && <p className="text-sm text-gray-600">TIN: {invoice.customer.tin}</p>}
        </div>
        {invoice.reference && (
          <div className="text-right">
            <p className="text-xs font-semibold uppercase text-gray-400">Reference</p>
            <p className="mt-1 text-sm text-gray-600">{invoice.reference}</p>
          </div>
        )}
      </div>

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs uppercase text-gray-400">
            <th className="py-2 font-medium">Description</th>
            <th className="py-2 font-medium text-right">Qty</th>
            <th className="py-2 font-medium text-right">Unit Price</th>
            <th className="py-2 font-medium text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id} className="border-b border-gray-100">
              <td className="py-2.5">{item.description}</td>
              <td className="py-2.5 text-right">
                {item.quantity} {item.unit}
              </td>
              <td className="py-2.5 text-right">{formatMoney(item.unit_price, symbol)}</td>
              <td className="py-2.5 text-right font-medium">{formatMoney(item.total, symbol)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <div className="w-64 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatMoney(invoice.subtotal, symbol)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Discount</span>
            <span>−{formatMoney(invoice.discount_total, symbol)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
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

      {(invoice.notes || invoice.terms) && (
        <div className="mt-8 grid grid-cols-2 gap-6 border-t border-gray-200 pt-4 text-xs text-gray-500">
          {invoice.notes && (
            <div>
              <p className="font-semibold uppercase text-gray-400">Notes</p>
              <p className="mt-1 whitespace-pre-line">{invoice.notes}</p>
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

      {((company?.signature_enabled && company.signature_url) || (company?.stamp_enabled && company.stamp_url)) && (
        <div className="mt-10 flex items-end justify-end gap-8 border-t border-gray-100 pt-6">
          {company.signature_enabled && company.signature_url && (
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element -- server-hosted branding asset */}
              <img
                src={company.signature_url}
                alt="Authorized signature"
                style={{ width: company.signature_width }}
                className="mx-auto object-contain"
              />
              <p className="mt-1 border-t border-gray-300 pt-1 text-xs text-gray-500">Authorized Signature</p>
            </div>
          )}
          {company.stamp_enabled && company.stamp_url && (
            // eslint-disable-next-line @next/next/no-img-element -- server-hosted branding asset
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
          )}
        </div>
      )}
    </div>
  );
}
