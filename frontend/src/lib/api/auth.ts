import { apiClient, ensureCsrfCookie } from "./client";
import type { ApiResponse, User } from "./types";

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export async function login(payload: LoginPayload): Promise<User> {
  await ensureCsrfCookie();
  const { data } = await apiClient.post<ApiResponse<User>>("/login", payload);

  return data.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/logout");
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>("/user");

  return data.data;
}
