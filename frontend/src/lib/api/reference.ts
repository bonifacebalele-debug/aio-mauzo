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
