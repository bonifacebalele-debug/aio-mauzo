import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://api.aio-mauzo.local";

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: "application/json",
  },
});

/**
 * Sanctum's SPA cookie auth requires a CSRF cookie to be present before any
 * state-changing request. Call once before login, and axios's withXSRFToken
 * handles attaching it to subsequent requests automatically.
 */
export async function ensureCsrfCookie(): Promise<void> {
  await axios.get(`${API_URL}/sanctum/csrf-cookie`, { withCredentials: true });
}

let onUnauthorized: (() => void) | null = null;

export function registerUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      onUnauthorized?.();
    }

    return Promise.reject(error);
  },
);

export interface ApiErrorShape {
  message: string;
  errors?: Record<string, string[]>;
}

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorShape | undefined;

    if (data?.errors) {
      const firstError = Object.values(data.errors)[0]?.[0];
      if (firstError) return firstError;
    }

    if (data?.message) return data.message;
  }

  return "Something went wrong. Please try again.";
}
