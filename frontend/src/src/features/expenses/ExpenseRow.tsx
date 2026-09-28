"use client";

import { FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/StatusPill";
import type { Expense } from "@/lib/api/types";
import { formatDate, formatMoney } from "@/lib/utils/format";

interface ExpenseRowProps {
  expense: Expense;
  onDelete: (expense: Expense) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export function ExpenseTableRow({ expense, onDelete, canEdit, canDelete }: ExpenseRowProps) {
  const amount = formatMoney(expense.amount, expense.currency.symbol);

  return (
    <tr className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--neutral-bg)]/60">
      <td className="px-4 py-3">
        {canEdit ? (
          <Link href={`/expenses/${expense.id}/edit`} className="font-medium text-foreground hover:text-primary">
            {expense.vendor || expense.category.name}
          </Link>
        ) : (
          <span className="font-medium text-foreground">{expense.vendor || expense.category.name}</span>
        )}
        {expense.description && <p className="truncate text-xs text-foreground-faint">{expense.description}</p>}
      </td>
      <td className="px-4 py-3">
        <Badge>{expense.category.name}</Badge>
      </td>
      <td className="px-4 py-3 text-sm text-foreground-muted">{formatDate(expense.expense_date)}</td>
      <td className="px-4 py-3 text-sm font-medium tabular-nums">{amount}</td>
      <td className="px-4 py-3">
        {expense.receipt_url ? (
          <a
            href={expense.receipt_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <FileText className="h-3.5 w-3.5" /> Receipt
          </a>
        ) : (
          <span className="text-xs text-foreground-faint">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        {canDelete && (
          <button
            onClick={() => onDelete(expense)}
            className="rounded-[var(--radius-sm)] p-2 text-foreground-faint transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
            aria-label="Delete expense"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </td>
    </tr>
  );
}

export function ExpenseCard({ expense, onDelete, canEdit, canDelete }: ExpenseRowProps) {
  const amount = formatMoney(expense.amount, expense.currency.symbol);

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-2">
        {canEdit ? (
          <Link href={`/expenses/${expense.id}/edit`} className="min-w-0">
            <p className="truncate font-medium">{expense.vendor || expense.category.name}</p>
            <p className="text-xs text-foreground-faint">{formatDate(expense.expense_date)}</p>
          </Link>
        ) : (
          <div className="min-w-0">
            <p className="truncate font-medium">{expense.vendor || expense.category.name}</p>
            <p className="text-xs text-foreground-faint">{formatDate(expense.expense_date)}</p>
          </div>
        )}
        {canDelete && (
          <button
            onClick={() => onDelete(expense)}
            className="shrink-0 rounded-[var(--radius-sm)] p-2 text-foreground-faint hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
            aria-label="Delete expense"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Badge>{expense.category.name}</Badge>
        <span className="text-sm font-semibold tabular-nums">{amount}</span>
      </div>
      {expense.receipt_url && (
        <a
          href={expense.receipt_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <FileText className="h-3.5 w-3.5" /> Receipt
        </a>
      )}
    </div>
  );
}
