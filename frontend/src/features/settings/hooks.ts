import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteBrandingAsset, uploadBrandingAsset, type BrandingAsset } from "@/lib/api/branding";
import { fetchCompanySettings, updateCompanySettings } from "@/lib/api/settings";
import type { Company } from "@/lib/api/types";

export function useCompanySettings() {
  return useQuery({ queryKey: ["settings", "company"], queryFn: fetchCompanySettings });
}

export function useUpdateCompanySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Company>) => updateCompanySettings(payload),
    onSuccess: (company) => queryClient.setQueryData(["settings", "company"], company),
  });
}

export function useUploadBrandingAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ asset, file }: { asset: BrandingAsset; file: File }) => uploadBrandingAsset(asset, file),
    onSuccess: (company) => queryClient.setQueryData(["settings", "company"], company),
  });
}

export function useDeleteBrandingAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (asset: BrandingAsset) => deleteBrandingAsset(asset),
    onSuccess: (company) => queryClient.setQueryData(["settings", "company"], company),
  });
}
