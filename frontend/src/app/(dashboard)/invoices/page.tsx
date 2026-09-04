"use client";

import { FileText, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Select } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { InvoiceCard, InvoiceTableRow } from "@/features/invoices/InvoiceRow";
import { useDeleteInvoice, useDuplicateInvoice, useInvoices } from "@/features/invoices/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import type { Invoice, InvoiceStatus } from "@/lib/api/types";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

const STATUS_OPTIONS: { value: InvoiceStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "viewed", label: "Viewed" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
];

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<InvoiceStatus | "">("");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<Invoice | null>(null);

  const hasPermission = useAuthStore((s) => s.hasPermission);
  const canCreate = hasPermission("invoices.create");
  const canDelete = hasPermission("invoices.delete");

  const { data, isLoading } = useInvoices({
    search: search || undefined,
    status: status || undefined,
    page,
    per_page: 15,
  });
  const deleteInvoice = useDeleteInvoice();
  const duplicateInvoice = useDuplicateInvoice();

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteInvoice.mutateAsync(pendingDelete.id);
      toast.success(`Invoice ${pendingDelete.invoice_number} deleted.`);
      setPendingDelete(null);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleDuplicate = async (invoice: Invoice) => {
    try {
      const copy = await duplicateInvoice.mutateAsync(invoice.id);
      toast.success(`Duplicated as ${copy.invoice_number}.`);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Create, track, and manage customer invoices"
        actions={
          canCreate && (
            <Link href="/invoices/new" className={buttonVariants({ className: "gap-2" })}>
              <Plus className="h-4 w-4" /> New Invoice
            </Link>
          )
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-faint" />
          <Input
            placeholder="Search invoice #, customer, reference…"
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          className="w-44"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as InvoiceStatus | "");
            setPage(1);
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
        {isLoading ? (
          <TableSkeleton rows={6} cols={4} />
        ) : !data?.data.length ? (
          <EmptyState
            icon={FileText}
            title="No invoices found"
            description={search || status ? "Try different filters." : "Create your first invoice to get started."}
            action={
              canCreate &&
              !search &&
              !status && (
                <Link href="/invoices/new" className={buttonVariants({ size: "sm", className: "gap-2" })}>
                  <Plus className="h-4 w-4" /> New Invoice
                </Link>
              )
            }
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-foreground-faint">
                    <th className="px-4 py-3 font-medium">Invoice</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((invoice) => (
                    <InvoiceTableRow
                      key={invoice.id}
                      invoice={invoice}
                      canDelete={canDelete}
                      canCreate={canCreate}
                      onDelete={setPendingDelete}
                      onDuplicate={handleDuplicate}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-3 p-4 sm:hidden">
              {data.data.map((invoice) => (
                <InvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  canDelete={canDelete}
                  canCreate={canCreate}
                  onDelete={setPendingDelete}
                  onDuplicate={handleDuplicate}
                />
              ))}
            </div>

            <Pagination meta={data.meta} onPageChange={setPage} />
          </>
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete invoice"
        description={`This will remove invoice "${pendingDelete?.invoice_number}". This action can be reversed by an administrator.`}
        loading={deleteInvoice.isPending}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
