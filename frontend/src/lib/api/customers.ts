import { API_URL, apiClient } from "./client";
import type { ApiResponse, Customer, CustomerPayload, CustomerStatement, PaginatedResponse } from "./types";

export interface CustomerFilters {
  search?: string;
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

export async function fetchCustomers(filters: CustomerFilters = {}): Promise<PaginatedResponse<Customer>> {
  const { data } = await apiClient.get<PaginatedResponse<Customer>>("/customers", { params: filters });

  return data;
}

export async function fetchCustomer(id: number): Promise<Customer> {
  const { data } = await apiClient.get<ApiResponse<Customer>>(`/customers/${id}`);

  return data.data;
}

export async function createCustomer(payload: Partial<CustomerPayload>): Promise<Customer> {
  const { data } = await apiClient.post<ApiResponse<Customer>>("/customers", payload);

  return data.data;
}

export async function updateCustomer(id: number, payload: Partial<CustomerPayload>): Promise<Customer> {
  const { data } = await apiClient.put<ApiResponse<Customer>>(`/customers/${id}`, payload);

  return data.data;
}

export async function deleteCustomer(id: number): Promise<void> {
  await apiClient.delete(`/customers/${id}`);
}

export async function searchCustomers(term: string): Promise<Customer[]> {
  const { data } = await apiClient.get<ApiResponse<Customer[]>>("/customers/search", { params: { q: term } });

  return data.data;
}

export interface StatementFilters {
  from?: string;
  to?: string;
}

export async function fetchCustomerStatement(id: number, filters: StatementFilters = {}): Promise<CustomerStatement> {
  const { data } = await apiClient.get<ApiResponse<CustomerStatement>>(`/customers/${id}/statement`, {
    params: filters,
  });

  return data.data;
}

export function getStatementPdfUrl(id: number, filters: StatementFilters = {}): string {
  const params = new URLSearchParams(filters as Record<string, string>);

  return `${API_URL}/api/customers/${id}/statement/pdf?${params.toString()}`;
}
