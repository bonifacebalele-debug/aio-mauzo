import { apiClient } from "./client";
import type { ApiResponse, Currency, Tax } from "./types";

export async function fetchCurrencies(): Promise<Currency[]> {
  const { data } = await apiClient.get<ApiResponse<Currency[]>>("/currencies");

  return data.data;
}

export async function fetchTaxes(): Promise<Tax[]> {
  const { data } = await apiClient.get<ApiResponse<Tax[]>>("/taxes");

  return data.data;
}

export async function fetchRoles(): Promise<string[]> {
  const { data } = await apiClient.get<ApiResponse<string[]>>("/roles");

  return data.data;
}

/**
 * Roles the current user is allowed to assign — Administrator gets all of
 * them, a Manager (users.request only) gets a restricted list that
 * excludes Administrator and Manager.
 */
export async function fetchAssignableRoles(): Promise<string[]> {
  const { data } = await apiClient.get<ApiResponse<string[]>>("/roles/assignable");

  return data.data;
}
