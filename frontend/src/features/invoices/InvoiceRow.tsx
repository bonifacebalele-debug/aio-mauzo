"use client";

import { Copy, Trash2 } from "lucide-react";
import Link from "next/link";
import { StatusPill } from "@/components/ui/StatusPill";
import type { Invoice } from "@/lib/api/types";
import { formatDate, formatMoney } from "@/lib/utils/format";

interface InvoiceRowProps {
  invoice: Invoice;
  onDelete: (invoice: Invoice) => void;
  onDuplicate: (invoice: Invoice) => void;
  canDelete: boolean;
  canCreate: boolean;
}

export function InvoiceTableRow({ invoice, onDelete, onDuplicate, canDelete, canCreate }: InvoiceRowProps) {
  return (
    <tr className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--neutral-bg)]/60">
      <td className="px-4 py-3">
        <Link href={`/invoices/${invoice.id}`} className="font-medium text-foreground hover:text-primary">
          {invoice.invoice_number}
        </Link>
        <p className="text-xs text-foreground-faint">{formatDate(invoice.invoice_date)}</p>
      </td>
      <td className="px-4 py-3 text-sm text-foreground-muted">{invoice.customer?.company_name ?? "—"}</td>
      <td className="px-4 py-3 text-sm font-medium tabular-nums">
        {formatMoney(invoice.grand_total, invoice.currency.symbol)}
      </td>
      <td className="px-4 py-3">
        <StatusPill status={invoice.status} label={invoice.status_label} />
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-1">
          {canCreate && (
            <button
              onClick={() => onDuplicate(invoice)}
              className="rounded-[var(--radius-sm)] p-2 text-foreground-faint transition-colors hover:bg-[var(--neutral-bg)] hover:text-foreground"
              aria-label="Duplicate invoice"
            >
              <Copy className="h-4 w-4" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(invoice)}
              className="rounded-[var(--radius-sm)] p-2 text-foreground-faint transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
              aria-label="Delete invoice"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export function InvoiceCard({ invoice, onDelete, onDuplicate, canDelete, canCreate }: InvoiceRowProps) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/invoices/${invoice.id}`} className="min-w-0">
          <p className="font-medium">{invoice.invoice_number}</p>
          <p className="truncate text-xs text-foreground-faint">{invoice.customer?.company_name ?? "—"}</p>
        </Link>
        <StatusPill status={invoice.status} label={invoice.status_label} />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-foreground-faint">{formatDate(invoice.invoice_date)}</p>
        <p className="text-sm font-semibold tabular-nums">{formatMoney(invoice.grand_total, invoice.currency.symbol)}</p>
      </div>
      <div className="mt-3 flex justify-end gap-1 border-t border-[var(--border)] pt-2">
        {canCreate && (
          <button
            onClick={() => onDuplicate(invoice)}
            className="rounded-[var(--radius-sm)] p-2 text-foreground-faint hover:bg-[var(--neutral-bg)]"
            aria-label="Duplicate invoice"
          >
            <Copy className="h-4 w-4" />
          </button>
        )}
        {canDelete && (
          <button
            onClick={() => onDelete(invoice)}
            className="rounded-[var(--radius-sm)] p-2 text-foreground-faint hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
            aria-label="Delete invoice"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
