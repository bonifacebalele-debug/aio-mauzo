import type { Invoice } from "@/lib/api/types";
import { formatMoney } from "./format";

/**
 * Builds a wa.me deep link with a prefilled message. If the customer has a
 * phone number it opens a chat directly with them; otherwise it opens
 * WhatsApp's share sheet so the user can pick a recipient.
 *
 * WhatsApp's click-to-chat links can never truly "attach" a file — they can
 * only pre-fill text — so the invoice link line is what stands in for the
 * attachment. Pass `pdfUrlOverride` when the caller just generated a fresh
 * PDF and wants to use that URL immediately, without waiting for the
 * `invoice` prop to refetch.
 */
export function buildWhatsAppShareLink(invoice: Invoice, pdfUrlOverride?: string | null): string {
  const pdfUrl = pdfUrlOverride !== undefined ? pdfUrlOverride : invoice.pdf_url;
  const amount = formatMoney(invoice.grand_total, invoice.currency.symbol);
  const message = [
    `Hello ${invoice.customer.contact_person || invoice.customer.company_name},`,
    "",
    `Please find your invoice ${invoice.invoice_number}.`,
    `Amount: ${amount}`,
    invoice.due_date ? `Due: ${invoice.due_date}` : null,
    pdfUrl ? pdfUrl : null,
    "",
    "Thank you.",
  ]
    .filter(Boolean)
    .join("\n");

  const phone = invoice.customer.phone?.replace(/[^\d+]/g, "");
  const encoded = encodeURIComponent(message);

  return phone ? `https://wa.me/${phone.replace("+", "")}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}
