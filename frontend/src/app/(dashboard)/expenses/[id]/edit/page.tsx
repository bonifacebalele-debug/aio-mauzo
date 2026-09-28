"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { ExpenseForm, type ExpenseFormValues } from "@/features/expenses/ExpenseForm";
import { useExpense, useUpdateExpense } from "@/features/expenses/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

export default function EditExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const expenseId = Number(id);
  const router = useRouter();

  const { data: expense, isLoading } = useExpense(expenseId);
  const updateExpense = useUpdateExpense(expenseId);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const canManageCategories = hasPermission("expenses.manage_categories");

  const handleSubmit = async (values: ExpenseFormValues, receipt: File | null, removeReceipt: boolean) => {
    try {
      await updateExpense.mutateAsync({
        expense_category_id: values.expense_category_id,
        currency_id: values.currency_id,
        amount: values.amount,
        expense_date: values.expense_date,
        vendor: values.vendor || undefined,
        description: values.description || undefined,
        receipt,
        remove_receipt: removeReceipt,
      });
      toast.success("Expense updated.");
      router.push("/expenses");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  if (isLoading || !expense) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-foreground-faint" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Edit Expense" description={expense.vendor || expense.category.name} />
      <Card className="max-w-3xl">
        <CardContent>
          <ExpenseForm
            defaultValues={expense}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
            canManageCategories={canManageCategories}
          />
        </CardContent>
      </Card>
    </div>
  );
}
