"use client";

import { Banknote, Download, FileSpreadsheet, FileText, Plus, Receipt, Search, Tag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Select } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/features/dashboard/StatCard";
import { ExpenseCard, ExpenseTableRow } from "@/features/expenses/ExpenseRow";
import { useDeleteExpense, useExpenseCategories, useExpenseSummary, useExpenses } from "@/features/expenses/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import { getExpenseExportUrl } from "@/lib/api/expenses";
import type { Expense } from "@/lib/api/types";
import { formatMoney } from "@/lib/utils/format";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

export default function ExpensesPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<Expense | null>(null);

  const hasPermission = useAuthStore((s) => s.hasPermission);
  const canCreate = hasPermission("expenses.create");
  const canEdit = hasPermission("expenses.edit");
  const canDelete = hasPermission("expenses.delete");
  const canManageCategories = hasPermission("expenses.manage_categories");
  const canExport = hasPermission("reports.export");

  const filters = {
    search: search || undefined,
    category_id: categoryId ? Number(categoryId) : undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
  };

  const { data, isLoading } = useExpenses({ ...filters, page, per_page: 15 });
  const { data: summary, isLoading: summaryLoading } = useExpenseSummary(filters);
  const { data: categories } = useExpenseCategories();
  const deleteExpense = useDeleteExpense();

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteExpense.mutateAsync(pendingDelete.id);
      toast.success("Expense deleted.");
      setPendingDelete(null);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const primaryTotal = summary?.by_currency[0];
  const topCategory = summary?.by_category[0];

  return (
    <div>
      <PageHeader
        title="Expenses"
        description="Track office overhead — electricity, internet, rent and more"
        actions={
          canCreate && (
            <Link href="/expenses/new" className={buttonVariants({ className: "gap-2" })}>
              <Plus className="h-4 w-4" /> New Expense
            </Link>
          )
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Spent"
          value={primaryTotal ? formatMoney(primaryTotal.total, primaryTotal.currency_symbol) : formatMoney(0)}
          icon={Banknote}
          accent="primary"
          loading={summaryLoading}
        />
        <StatCard
          label="Expenses Logged"
          value={String(primaryTotal?.count ?? 0)}
          icon={Receipt}
          accent="info"
          loading={summaryLoading}
        />
        <StatCard
          label="Top Category"
          value={topCategory ? topCategory.category_name : "—"}
          icon={Tag}
          accent="warning"
          loading={summaryLoading}
        />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-faint" />
          <Input
            placeholder="Search by vendor or description…"
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          className="sm:w-48"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All categories</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Input
          type="date"
          className="sm:w-40"
          value={dateFrom}
          onChange={(e) => {
            setDateFrom(e.target.value);
            setPage(1);
          }}
        />
        <Input
          type="date"
          className="sm:w-40"
          value={dateTo}
          onChange={(e) => {
            setDateTo(e.target.value);
            setPage(1);
          }}
        />

        {canExport && (
          <div className="flex gap-2 sm:ml-auto">
            <a
              href={getExpenseExportUrl("csv", filters)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm", className: "gap-1.5" })}
            >
              <Download className="h-4 w-4" /> CSV
            </a>
            <a
              href={getExpenseExportUrl("xlsx", filters)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm", className: "gap-1.5" })}
            >
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </a>
            <a
              href={getExpenseExportUrl("pdf", filters)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm", className: "gap-1.5" })}
            >
              <FileText className="h-4 w-4" /> PDF
            </a>
          </div>
        )}
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
        {isLoading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : !data?.data.length ? (
          <EmptyState
            icon={Receipt}
            title="No expenses found"
            description={
              search || categoryId || dateFrom || dateTo
                ? "Try a different search or filter."
                : "Log your first office expense to get started."
            }
            action={
              canCreate &&
              !search &&
              !categoryId && (
                <Link href="/expenses/new" className={buttonVariants({ size: "sm", className: "gap-2" })}>
                  <Plus className="h-4 w-4" /> New Expense
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
                    <th className="px-4 py-3 font-medium">Vendor</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Receipt</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((expense) => (
                    <ExpenseTableRow
                      key={expense.id}
                      expense={expense}
                      canEdit={canEdit}
                      canDelete={canDelete}
                      onDelete={setPendingDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-3 p-4 sm:hidden">
              {data.data.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  canEdit={canEdit}
                  canDelete={canDelete}
                  onDelete={setPendingDelete}
                />
              ))}
            </div>

            <Pagination meta={data.meta} onPageChange={setPage} />
          </>
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete expense"
        description={`This will permanently remove this expense${pendingDelete?.vendor ? ` for "${pendingDelete.vendor}"` : ""}.`}
        loading={deleteExpense.isPending}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />

      {canManageCategories && (
        <p className="mt-4 text-xs text-foreground-faint">
          As an Administrator, you can add new expense categories from the New Expense form.
        </p>
      )}
    </div>
  );
}
