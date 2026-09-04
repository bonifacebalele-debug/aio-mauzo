"use client";

import { Plus, Search, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
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

  const hasPermission = useAuthStore((s) => s.hasPermission);
  const canCreate = hasPermission("customers.create");
  const canDelete = hasPermission("customers.delete");

  const { data, isLoading } = useCustomers({ search: search || undefined, page, per_page: 15 });
  const deleteCustomer = useDeleteCustomer();

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

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Manage the businesses and individuals you invoice"
        actions={
          canCreate && (
            <Link href="/customers/new" className={buttonVariants({ className: "gap-2" })}>
              <Plus className="h-4 w-4" /> New Customer
            </Link>
          )
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
    </div>
  );
}
