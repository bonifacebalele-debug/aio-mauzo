import { apiClient } from "./client";
import type {
  AdjustStockPayload,
  ApiResponse,
  PaginatedResponse,
  Product,
  ProductPayload,
  StockInPayload,
  StockMovement,
} from "./types";

export interface ProductFilters {
  search?: string;
  is_active?: boolean;
  low_stock?: boolean;
  page?: number;
  per_page?: number;
}

export async function fetchProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
  const { data } = await apiClient.get<PaginatedResponse<Product>>("/products", { params: filters });

  return data;
}

export async function fetchLowStockCount(): Promise<number> {
  const { data } = await apiClient.get<{ count: number }>("/products/low-stock-count");

  return data.count;
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  const { data } = await apiClient.post<ApiResponse<Product>>("/products", payload);

  return data.data;
}

export async function updateProduct(id: number, payload: ProductPayload): Promise<Product> {
  const { data } = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, payload);

  return data.data;
}

export async function stockIn(productId: number, payload: StockInPayload): Promise<StockMovement> {
  const { data } = await apiClient.post<ApiResponse<StockMovement>>(`/products/${productId}/stock-in`, payload);

  return data.data;
}

export async function adjustStock(productId: number, payload: AdjustStockPayload): Promise<StockMovement> {
  const { data } = await apiClient.post<ApiResponse<StockMovement>>(`/products/${productId}/adjust`, payload);

  return data.data;
}

export async function fetchProductMovements(
  productId: number,
  page = 1,
): Promise<PaginatedResponse<StockMovement>> {
  const { data } = await apiClient.get<PaginatedResponse<StockMovement>>(`/products/${productId}/movements`, {
    params: { page, per_page: 10 },
  });

  return data;
}
