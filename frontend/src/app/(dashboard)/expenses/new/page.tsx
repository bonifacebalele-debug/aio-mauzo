"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { ExpenseForm, type ExpenseFormValues } from "@/features/expenses/ExpenseForm";
import { useCreateExpense } from "@/features/expenses/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

export default function NewExpensePage() {
  const router = useRouter();
  const createExpense = useCreateExpense();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const canManageCategories = hasPermission("expenses.manage_categories");

  const handleSubmit = async (values: ExpenseFormValues, receipt: File | null) => {
    try {
      await createExpense.mutateAsync({
        expense_category_id: values.expense_category_id,
        currency_id: values.currency_id,
        amount: values.amount,
        expense_date: values.expense_date,
        vendor: values.vendor || undefined,
        description: values.description || undefined,
        receipt,
      });
      toast.success("Expense recorded.");
      router.push("/expenses");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <div>
      <PageHeader title="New Expense" description="Log an office expense" />
      <Card className="max-w-3xl">
        <CardContent>
          <ExpenseForm onSubmit={handleSubmit} submitLabel="Save expense" canManageCategories={canManageCategories} />
        </CardContent>
      </Card>
    </div>
  );
}
