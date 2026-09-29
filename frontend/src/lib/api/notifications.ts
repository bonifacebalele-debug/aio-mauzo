import { apiClient } from "./client";
import type { NotificationItem, PaginatedResponse } from "./types";

export async function fetchNotifications(page = 1): Promise<PaginatedResponse<NotificationItem>> {
  const { data } = await apiClient.get<PaginatedResponse<NotificationItem>>("/notifications", {
    params: { page, per_page: 20 },
  });

  return data;
}

export async function fetchUnreadCount(): Promise<number> {
  const { data } = await apiClient.get<{ count: number }>("/notifications/unread-count");

  return data.count;
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient.post(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.post("/notifications/read-all");
}
