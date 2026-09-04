import { apiClient } from "./client";
import type { ApiResponse, Company } from "./types";

export async function fetchCompanySettings(): Promise<Company> {
  const { data } = await apiClient.get<ApiResponse<Company>>("/settings/company");

  return data.data;
}

export async function updateCompanySettings(payload: Partial<Company>): Promise<Company> {
  const { data } = await apiClient.put<ApiResponse<Company>>("/settings/company", payload);

  return data.data;
}
