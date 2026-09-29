"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, FileText, MessageCircle, Receipt, UserCheck, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/features/notifications/hooks";
import type { NotificationItem } from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";
import { formatRelativeTime } from "@/lib/utils/format";

const ICONS: Record<string, LucideIcon> = {
  chat_message: MessageCircle,
  invoice_viewed: FileText,
  expense_logged: Receipt,
  account_activated: UserCheck,
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: unreadCount } = useUnreadNotificationCount();
  const { data, isLoading } = useNotifications(open);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleItemClick = (notification: NotificationItem) => {
    if (!notification.read_at) {
      markRead.mutate(notification.id);
    }
    setOpen(false);
  };

  const count = unreadCount ?? 0;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-foreground-muted transition-colors hover:bg-[var(--neutral-bg)] hover:text-foreground"
      >
        <Bell className="h-4.5 w-4.5" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[10px] font-semibold text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 z-50 mt-2 max-h-[70vh] w-80 overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <p className="text-sm font-semibold">Notifications</p>
              {count > 0 && (
                <button
                  onClick={() => markAllRead.mutate()}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <Check className="h-3.5 w-3.5" /> Mark all read
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="p-4 text-center text-sm text-foreground-faint">Loading…</div>
            ) : !data?.data.length ? (
              <div className="p-8 text-center text-sm text-foreground-faint">You&apos;re all caught up.</div>
            ) : (
              <ul className="divide-y divide-[var(--border)]">
                {data.data.map((notification) => {
                  const Icon = ICONS[notification.type] ?? Bell;
                  const content = (
                    <div
                      className={cn(
                        "flex gap-3 px-4 py-3 transition-colors hover:bg-[var(--neutral-bg)]",
                        !notification.read_at && "bg-primary/5",
                      )}
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--neutral-bg)] text-foreground-muted">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{notification.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-foreground-muted">{notification.body}</p>
                        <p className="mt-1 text-[11px] text-foreground-faint">
                          {formatRelativeTime(notification.created_at)}
                        </p>
                      </div>
                      {!notification.read_at && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    </div>
                  );

                  return (
                    <li key={notification.id}>
                      {notification.link ? (
                        <Link href={notification.link} onClick={() => handleItemClick(notification)}>
                          {content}
                        </Link>
                      ) : (
                        <button className="block w-full text-left" onClick={() => handleItemClick(notification)}>
                          {content}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
