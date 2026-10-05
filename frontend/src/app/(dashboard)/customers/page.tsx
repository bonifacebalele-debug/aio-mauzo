"use client";

import { Check, Copy, Plus, QrCode, Search, Users } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button, buttonVariants } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { CustomerCard, CustomerTableRow } from "@/features/customers/CustomerRow";
import { useCustomers, useDeleteCustomer } from "@/features/customers/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import type { Customer } from "@/lib/api/types";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<Customer | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasPermission = useAuthStore((s) => s.hasPermission);
  const canCreate = hasPermission("customers.create");
  const canDelete = hasPermission("customers.delete");

  const { data, isLoading } = useCustomers({ search: search || undefined, page, per_page: 15 });
  const deleteCustomer = useDeleteCustomer();

  const requestUrl = typeof window !== "undefined" ? `${window.location.origin}/request` : "";

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteCustomer.mutateAsync(pendingDelete.id);
      toast.success(`${pendingDelete.company_name} deleted.`);
      setPendingDelete(null);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(requestUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the link — copy it manually instead.");
    }
  };

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Manage the businesses and individuals you invoice"
        actions={
          <>
            {canCreate && (
              <Button variant="outline" className="gap-2" onClick={() => setShareOpen(true)}>
                <QrCode className="h-4 w-4" /> Share request link
              </Button>
            )}
            {canCreate && (
              <Link href="/customers/new" className={buttonVariants({ className: "gap-2" })}>
                <Plus className="h-4 w-4" /> New Customer
              </Link>
            )}
          </>
        }
      />

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-faint" />
          <Input
            placeholder="Search by name, phone, email, TIN…"
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
        {isLoading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : !data?.data.length ? (
          <EmptyState
            icon={Users}
            title="No customers found"
            description={search ? "Try a different search term." : "Add your first customer to get started."}
            action={
              canCreate &&
              !search && (
                <Link href="/customers/new" className={buttonVariants({ size: "sm", className: "gap-2" })}>
                  <Plus className="h-4 w-4" /> New Customer
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
                    <th className="px-4 py-3 font-medium">Company</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">City</th>
                    <th className="px-4 py-3 font-medium">Invoices</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((customer) => (
                    <CustomerTableRow
                      key={customer.id}
                      customer={customer}
                      canDelete={canDelete}
                      onDelete={setPendingDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-3 p-4 sm:hidden">
              {data.data.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} canDelete={canDelete} onDelete={setPendingDelete} />
              ))}
            </div>

            <Pagination meta={data.meta} onPageChange={setPage} />
          </>
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete customer"
        description={`This will remove "${pendingDelete?.company_name}". This action can be reversed by an administrator.`}
        loading={deleteCustomer.isPending}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <Modal open={shareOpen} onClose={() => setShareOpen(false)} title="Share request link">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-foreground-muted">
            Share this link or QR code with a customer. They can send you their details without needing an account
            — it&apos;ll show up under Customer Requests for your approval.
          </p>
          {requestUrl && (
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white p-4">
              <QRCodeSVG value={requestUrl} size={180} />
            </div>
          )}
          <div className="flex w-full items-center gap-2">
            <Input readOnly value={requestUrl} className="flex-1 text-xs" />
            <Button size="sm" variant="outline" onClick={handleCopy} className="shrink-0 gap-1.5">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
