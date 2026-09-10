import { apiClient } from "./client";
import type { ApiResponse, User } from "./types";

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone?: string;
}

export interface UpdateProfilePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export async function fetchProfile(): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>("/profile");

  return data.data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const { data } = await apiClient.put<ApiResponse<User>>("/profile", payload);

  return data.data;
}

export async function updateProfilePassword(payload: UpdateProfilePasswordPayload): Promise<void> {
  await apiClient.put("/profile/password", payload);
}
