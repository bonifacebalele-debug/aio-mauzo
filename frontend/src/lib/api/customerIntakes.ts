import { apiClient, ensureCsrfCookie } from "./client";
import type { ApiResponse, Customer, CustomerIntake, CustomerIntakePayload, PaginatedResponse } from "./types";

/**
 * Public, unauthenticated submission — used by the /request page. The API's
 * stateful-api middleware applies CSRF checks to every /api route (even
 * unauthenticated ones) for requests coming from a recognized frontend
 * origin, so we prime the CSRF cookie first, same as the login flow does.
 */
export async function submitCustomerIntake(payload: Partial<CustomerIntakePayload>): Promise<{ id: number }> {
  await ensureCsrfCookie();

  const { data } = await apiClient.post<{ message: string; data: { id: number } }>(
    "/public/customer-intakes",
    payload,
  );

  return data.data;
}

export interface CustomerIntakeFilters {
  status?: "pending" | "approved" | "rejected";
  page?: number;
  per_page?: number;
}

export async function fetchCustomerIntakes(
  filters: CustomerIntakeFilters = {},
): Promise<PaginatedResponse<CustomerIntake>> {
  const { data } = await apiClient.get<PaginatedResponse<CustomerIntake>>("/customer-intakes", { params: filters });

  return data;
}

export async function fetchPendingIntakeCount(): Promise<number> {
  const { data } = await apiClient.get<{ count: number }>("/customer-intakes/pending-count");

  return data.count;
}

export async function approveCustomerIntake(id: number): Promise<Customer> {
  const { data } = await apiClient.post<ApiResponse<Customer>>(`/customer-intakes/${id}/approve`);

  return data.data;
}

export async function rejectCustomerIntake(id: number, reason?: string): Promise<CustomerIntake> {
  const { data } = await apiClient.post<ApiResponse<CustomerIntake>>(`/customer-intakes/${id}/reject`, { reason });

  return data.data;
}
