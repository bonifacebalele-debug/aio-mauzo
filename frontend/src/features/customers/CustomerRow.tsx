"use client";

import { Mail, MapPin, Phone, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/StatusPill";
import type { Customer } from "@/lib/api/types";

interface CustomerRowProps {
  customer: Customer;
  onDelete: (customer: Customer) => void;
  canDelete: boolean;
}

export function CustomerTableRow({ customer, onDelete, canDelete }: CustomerRowProps) {
  return (
    <tr className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--neutral-bg)]/60">
      <td className="px-4 py-3">
        <Link href={`/customers/${customer.id}/edit`} className="font-medium text-foreground hover:text-primary">
          {customer.company_name}
        </Link>
        <p className="text-xs text-foreground-faint">{customer.contact_person}</p>
      </td>
      <td className="px-4 py-3 text-sm text-foreground-muted">{customer.phone ?? "—"}</td>
      <td className="px-4 py-3 text-sm text-foreground-muted">{customer.email ?? "—"}</td>
      <td className="px-4 py-3 text-sm text-foreground-muted">{customer.city ?? "—"}</td>
      <td className="px-4 py-3">
        <Badge>{customer.invoices_count ?? 0} invoices</Badge>
      </td>
      <td className="px-4 py-3 text-right">
        {canDelete && (
          <button
            onClick={() => onDelete(customer)}
            className="rounded-[var(--radius-sm)] p-2 text-foreground-faint transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
            aria-label="Delete customer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </td>
    </tr>
  );
}

export function CustomerCard({ customer, onDelete, canDelete }: CustomerRowProps) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/customers/${customer.id}/edit`} className="min-w-0">
          <p className="truncate font-medium">{customer.company_name}</p>
          <p className="truncate text-xs text-foreground-faint">{customer.contact_person}</p>
        </Link>
        {canDelete && (
          <button
            onClick={() => onDelete(customer)}
            className="shrink-0 rounded-[var(--radius-sm)] p-2 text-foreground-faint hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
            aria-label="Delete customer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="mt-3 space-y-1.5 text-xs text-foreground-muted">
        {customer.phone && (
          <div className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" /> {customer.phone}
          </div>
        )}
        {customer.email && (
          <div className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> {customer.email}
          </div>
        )}
        {customer.city && (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> {customer.city}
          </div>
        )}
      </div>
      <Badge className="mt-3">{customer.invoices_count ?? 0} invoices</Badge>
    </div>
  );
}
