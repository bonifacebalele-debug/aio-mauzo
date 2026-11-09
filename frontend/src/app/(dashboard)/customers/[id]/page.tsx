"use client";

import { Edit2, Loader2, MoreHorizontal, Receipt, Trash2, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { Badge, StatusPill } from "@/components/ui/StatusPill";
import { buttonVariants } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useCustomer, useDeleteCustomer } from "@/features/customers/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import { formatDate, formatDateTime, formatMoney } from "@/lib/utils/format";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

const AVATAR_COLORS = [
  "bg-primary/10 text-primary",
  "bg-[var(--success-bg)] text-[var(--success)]",
  "bg-[var(--warning-bg)] text-[var(--warning)]",
  "bg-[var(--info-bg)] text-[var(--info)]",
  "bg-[var(--danger-bg)] text-[var(--danger)]",
];

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return (words[0][0] + words[1][0]).toUpperCase();
}

function getAvatarColorClass(name: string): string {
  const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-foreground-faint">{label}</p>
      <p className="mt-1.5 truncate text-xl font-semibold tracking-tight tabular-nums" title={value}>
        {value}
      </p>
    </div>
  );
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const customerId = Number(id);
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const hasPermission = useAuthStore((s) => s.hasPermission);
  const canEdit = hasPermission("customers.edit");
  const canDelete = hasPermission("customers.delete");

  const { data: customer, isLoading } = useCustomer(customerId);
  const deleteCustomer = useDeleteCustomer();

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleDelete = async () => {
    if (!customer) return;
    try {
      await deleteCustomer.mutateAsync(customer.id);
      toast.success(`${customer.company_name} deleted.`);
      router.push("/customers");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  if (isLoading || !customer) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-foreground-faint" />
      </div>
    );
  }

  const invoices = customer.invoices ?? [];
  const payments = customer.payments ?? [];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-lg)] text-lg font-semibold ${getAvatarColorClass(
              customer.company_name,
            )}`}
          >
            {getInitials(customer.company_name)}
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{customer.company_name}</h1>
            {customer.contact_person && <p className="mt-0.5 text-sm text-foreground-muted">{customer.contact_person}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <Link href={`/customers/${customer.id}/edit`} className={buttonVariants({ variant: "outline", className: "gap-1.5" })}>
              <Edit2 className="h-4 w-4" /> Edit
            </Link>
          )}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className={buttonVariants({ variant: "outline", size: "icon" })}
              aria-label="More actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-44 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-1 shadow-lg">
                <Link
                  href={`/customers/${customer.id}/statement`}
                  className="flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-foreground transition-colors hover:bg-[var(--neutral-bg)]"
                  onClick={() => setMenuOpen(false)}
                >
                  <Receipt className="h-4 w-4" /> Statement
                </Link>
                {canDelete && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setConfirmDeleteOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm text-[var(--danger)] transition-colors hover:bg-[var(--danger-bg)]"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatBlock label="Invoices" value={String(customer.invoices_count ?? 0)} />
        <StatBlock label="Payments" value={String(customer.payments_count ?? 0)} />
        <StatBlock label="Total Invoiced" value={formatMoney(customer.total_invoiced ?? 0)} />
        <StatBlock label="Total Paid" value={formatMoney(customer.total_paid ?? 0)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-foreground-faint">Created</p>
                <p className="mt-0.5 text-foreground-muted">{formatDateTime(customer.created_at)}</p>
              </div>
              {customer.email && (
                <div>
                  <p className="text-xs text-foreground-faint">Email</p>
                  <p className="mt-0.5 text-foreground-muted">{customer.email}</p>
                </div>
              )}
              {customer.phone && (
                <div>
                  <p className="text-xs text-foreground-faint">Phone</p>
                  <p className="mt-0.5 text-foreground-muted">{customer.phone}</p>
                </div>
              )}
              {customer.city && (
                <div>
                  <p className="text-xs text-foreground-faint">City</p>
                  <p className="mt-0.5 text-foreground-muted">{customer.city}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bill To</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium text-foreground">{customer.company_name}</p>
              {customer.contact_person && <p className="text-foreground-muted">{customer.contact_person}</p>}
              {customer.physical_address && <p className="text-foreground-muted">{customer.physical_address}</p>}
              {(customer.city || customer.country) && (
                <p className="text-foreground-muted">{[customer.city, customer.country].filter(Boolean).join(", ")}</p>
              )}
              {customer.tin && <p className="text-foreground-faint">TIN: {customer.tin}</p>}
              {customer.vrn && <p className="text-foreground-faint">VRN: {customer.vrn}</p>}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Invoices</CardTitle>
                <Badge>{invoices.length}</Badge>
              </div>
              <Link href="/invoices/new" className="text-sm font-medium text-primary hover:underline">
                + New
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {invoices.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-foreground-faint">No invoices found</p>
              ) : (
                <>
                  <div className="hidden overflow-x-auto sm:block">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-foreground-faint">
                          <th className="px-5 py-3 font-medium">Reference</th>
                          <th className="px-5 py-3 font-medium">Date</th>
                          <th className="px-5 py-3 font-medium">Status</th>
                          <th className="px-5 py-3 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((invoice) => (
                          <tr key={invoice.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--neutral-bg)]/60">
                            <td className="px-5 py-3">
                              <Link href={`/invoices/${invoice.id}`} className="font-medium text-foreground hover:text-primary">
                                Invoice #{invoice.invoice_number}
                              </Link>
                            </td>
                            <td className="px-5 py-3 text-sm text-foreground-muted">{formatDate(invoice.invoice_date)}</td>
                            <td className="px-5 py-3">
                              <StatusPill status={invoice.status} label={invoice.status_label} />
                            </td>
                            <td className="px-5 py-3 text-sm font-medium tabular-nums">
                              {formatMoney(invoice.grand_total, invoice.currency_symbol ?? "")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="divide-y divide-[var(--border)] sm:hidden">
                    {invoices.map((invoice) => (
                      <Link
                        key={invoice.id}
                        href={`/invoices/${invoice.id}`}
                        className="flex items-center justify-between gap-2 px-5 py-3 hover:bg-[var(--neutral-bg)]/60"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">Invoice #{invoice.invoice_number}</p>
                          <p className="text-xs text-foreground-faint">{formatDate(invoice.invoice_date)}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-medium tabular-nums">
                            {formatMoney(invoice.grand_total, invoice.currency_symbol ?? "")}
                          </p>
                          <div className="mt-1">
                            <StatusPill status={invoice.status} label={invoice.status_label} />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Payments</CardTitle>
                <Badge>{payments.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <Wallet className="h-6 w-6 text-foreground-faint" />
                  <p className="text-sm text-foreground-faint">No Payments found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {payment.invoice_number ? `Invoice #${payment.invoice_number}` : "—"}
                        </p>
                        <p className="truncate text-xs text-foreground-faint">
                          {formatDate(payment.payment_date)}
                          {payment.payment_method ? ` · ${payment.payment_method}` : ""}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold tabular-nums text-[var(--success)]">
                        +{formatMoney(payment.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete customer"
        description={`This will remove "${customer.company_name}". This action can be reversed by an administrator.`}
        loading={deleteCustomer.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </div>
  );
}
