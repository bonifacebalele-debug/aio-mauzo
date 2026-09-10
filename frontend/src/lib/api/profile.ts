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

export async function uploadProfileSignature(file: File): Promise<User> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<ApiResponse<User>>("/profile/signature", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.data;
}

export async function deleteProfileSignature(): Promise<User> {
  const { data } = await apiClient.delete<ApiResponse<User>>("/profile/signature");

  return data.data;
}
