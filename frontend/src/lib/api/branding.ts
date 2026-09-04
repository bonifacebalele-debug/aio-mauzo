import { apiClient } from "./client";
import type { ApiResponse, Company } from "./types";

export type BrandingAsset = "logo" | "signature" | "stamp";

export async function uploadBrandingAsset(asset: BrandingAsset, file: File): Promise<Company> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<ApiResponse<Company>>(`/settings/company/${asset}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.data;
}

export async function deleteBrandingAsset(asset: BrandingAsset): Promise<Company> {
  const { data } = await apiClient.delete<ApiResponse<Company>>(`/settings/company/${asset}`);

  return data.data;
}
