import { apiClient } from "./client";
import type {
  ApiResponse,
  Expense,
  ExpenseCategory,
  ExpensePayload,
  ExpenseSummary,
  PaginatedResponse,
} from "./types";

export interface ExpenseFilters {
  search?: string;
  category_id?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}

function toFormData(payload: Partial<ExpensePayload>): FormData {
  const formData = new FormData();

  if (payload.expense_category_id !== undefined) {
    formData.append("expense_category_id", String(payload.expense_category_id));
  }
  if (payload.currency_id !== undefined) {
    formData.append("currency_id", String(payload.currency_id));
  }
  if (payload.amount !== undefined) {
    formData.append("amount", String(payload.amount));
  }
  if (payload.expense_date !== undefined) {
    formData.append("expense_date", payload.expense_date);
  }
  if (payload.vendor) {
    formData.append("vendor", payload.vendor);
  }
  if (payload.description) {
    formData.append("description", payload.description);
  }
  if (payload.receipt) {
    formData.append("receipt", payload.receipt);
  }
  if (payload.remove_receipt) {
    formData.append("remove_receipt", "1");
  }

  return formData;
}

export async function fetchExpenses(filters: ExpenseFilters = {}): Promise<PaginatedResponse<Expense>> {
  const { data } = await apiClient.get<PaginatedResponse<Expense>>("/expenses", { params: filters });

  return data;
}

export async function fetchExpense(id: number): Promise<Expense> {
  const { data } = await apiClient.get<ApiResponse<Expense>>(`/expenses/${id}`);

  return data.data;
}

export async function fetchExpenseSummary(
  filters: Omit<ExpenseFilters, "page" | "per_page"> = {},
): Promise<ExpenseSummary> {
  const { data } = await apiClient.get<ApiResponse<ExpenseSummary>>("/expenses/summary", { params: filters });

  return data.data;
}

export async function createExpense(payload: ExpensePayload): Promise<Expense> {
  const { data } = await apiClient.post<ApiResponse<Expense>>("/expenses", toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.data;
}

// PHP can't parse a multipart body on a real PUT request, so updates that
// might include a file go through Laravel's method-spoofing convention:
// POST the multipart body with a `_method=PUT` field, and the route still
// resolves to the PUT handler.
export async function updateExpense(id: number, payload: ExpensePayload): Promise<Expense> {
  const formData = toFormData(payload);
  formData.append("_method", "PUT");

  const { data } = await apiClient.post<ApiResponse<Expense>>(`/expenses/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.data;
}

export async function deleteExpense(id: number): Promise<void> {
  await apiClient.delete(`/expenses/${id}`);
}

export async function fetchExpenseCategories(includeInactive = false): Promise<ExpenseCategory[]> {
  const { data } = await apiClient.get<ApiResponse<ExpenseCategory[]>>("/expense-categories", {
    params: includeInactive ? { include_inactive: 1 } : undefined,
  });

  return data.data;
}

export async function createExpenseCategory(name: string): Promise<ExpenseCategory> {
  const { data } = await apiClient.post<ApiResponse<ExpenseCategory>>("/expense-categories", { name });

  return data.data;
}
