import { apiClient } from "./client";
import type {
  ApiResponse,
  ApproveUserPayload,
  PaginatedResponse,
  RejectUserPayload,
  RequestUserPayload,
  User,
  UserPayload,
  UserStatus,
} from "./types";

export interface UserFilters {
  search?: string;
  role?: string;
  is_active?: boolean;
  status?: UserStatus;
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

/**
 * Manager's restricted create flow — submits a new user for Administrator
 * approval instead of activating it immediately. No password: the invited
 * user sets their own via the verification email sent after approval.
 */
export async function requestCreateUser(payload: RequestUserPayload): Promise<User> {
  const { data } = await apiClient.post<ApiResponse<User>>("/users/request", payload);

  return data.data;
}

export async function approveUser(id: number, payload: ApproveUserPayload = {}): Promise<User> {
  const { data } = await apiClient.post<ApiResponse<User>>(`/users/${id}/approve`, payload);

  return data.data;
}

export async function rejectUser(id: number, payload: RejectUserPayload = {}): Promise<User> {
  const { data } = await apiClient.post<ApiResponse<User>>(`/users/${id}/reject`, payload);

  return data.data;
}
