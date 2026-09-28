import { apiClient, ensureCsrfCookie } from "./client";
import type { ApiResponse, RegisterPayload, User, VerifyUserPayload } from "./types";

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

export async function register(payload: RegisterPayload): Promise<{ message: string }> {
  // Public entry point — the visitor may never have loaded /login, so
  // there's no CSRF cookie yet. Same guard login() uses.
  await ensureCsrfCookie();
  const { data } = await apiClient.post<{ message: string }>("/register", payload);

  return data;
}

export async function verifyAccount(payload: VerifyUserPayload): Promise<{ message: string }> {
  await ensureCsrfCookie();
  const { data } = await apiClient.post<{ message: string }>("/verify-user", payload);

  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/logout");
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>("/user");

  return data.data;
}
