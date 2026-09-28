import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExpense,
  createExpenseCategory,
  deleteExpense,
  fetchExpense,
  fetchExpenseCategories,
  fetchExpenseSummary,
  fetchExpenses,
  updateExpense,
  type ExpenseFilters,
} from "@/lib/api/expenses";
import type { ExpensePayload } from "@/lib/api/types";

export function useExpenses(filters: ExpenseFilters) {
  return useQuery({
    queryKey: ["expenses", filters],
    queryFn: () => fetchExpenses(filters),
    placeholderData: (prev) => prev,
  });
}

export function useExpense(id: number | undefined) {
  return useQuery({
    queryKey: ["expenses", id],
    queryFn: () => fetchExpense(id as number),
    enabled: id !== undefined,
  });
}

export function useExpenseSummary(filters: Omit<ExpenseFilters, "page" | "per_page">) {
  return useQuery({
    queryKey: ["expenses", "summary", filters],
    queryFn: () => fetchExpenseSummary(filters),
    placeholderData: (prev) => prev,
  });
}

export function useExpenseCategories(includeInactive = false) {
  return useQuery({
    queryKey: ["expense-categories", includeInactive],
    queryFn: () => fetchExpenseCategories(includeInactive),
    staleTime: 5 * 60_000,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ExpensePayload) => createExpense(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useUpdateExpense(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ExpensePayload) => updateExpense(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteExpense(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
  });
}

export function useCreateExpenseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createExpenseCategory(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expense-categories"] }),
  });
}
