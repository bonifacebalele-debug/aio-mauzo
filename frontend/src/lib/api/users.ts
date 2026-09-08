import { apiClient } from "./client";
import type { ApiResponse, PaginatedResponse, User, UserPayload } from "./types";

export interface UserFilters {
  search?: string;
  role?: string;
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

export async function fetchUsers(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
  const { data } = await apiClient.get<PaginatedResponse<User>>("/users", { params: filters });

  return data;
}

export async function fetchUser(id: number): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>(`/users/${id}`);

  return data.data;
}

export async function createUser(payload: UserPayload): Promise<User> {
  const { data } = await apiClient.post<ApiResponse<User>>("/users", payload);

  return data.data;
}

export async function updateUser(id: number, payload: Partial<UserPayload>): Promise<User> {
  const { data } = await apiClient.put<ApiResponse<User>>(`/users/${id}`, payload);

  return data.data;
}

export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}
