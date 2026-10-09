import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adjustStock,
  createProduct,
  fetchLowStockCount,
  fetchProductMovements,
  fetchProducts,
  stockIn,
  updateProduct,
  type ProductFilters,
} from "@/lib/api/products";
import type { AdjustStockPayload, ProductPayload, StockInPayload } from "@/lib/api/types";

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
    placeholderData: (prev) => prev,
  });
}

export function useLowStockCount() {
  return useQuery({
    queryKey: ["products", "low-stock-count"],
    queryFn: fetchLowStockCount,
    refetchInterval: 30_000,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProductPayload) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProductPayload) => updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useStockIn(productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StockInPayload) => stockIn(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", productId, "movements"] });
    },
  });
}

export function useAdjustStock(productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdjustStockPayload) => adjustStock(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", productId, "movements"] });
    },
  });
}

export function useProductMovements(productId: number | undefined, page: number) {
  return useQuery({
    queryKey: ["products", productId, "movements", page],
    queryFn: () => fetchProductMovements(productId as number, page),
    enabled: productId !== undefined,
    placeholderData: (prev) => prev,
  });
}
