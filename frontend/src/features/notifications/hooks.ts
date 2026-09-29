import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api/notifications";

const POLL_INTERVAL = 10_000;

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: fetchUnreadCount,
    refetchInterval: POLL_INTERVAL,
  });
}

export function useNotifications(enabled: boolean) {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(),
    enabled,
    refetchInterval: enabled ? POLL_INTERVAL : false,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
