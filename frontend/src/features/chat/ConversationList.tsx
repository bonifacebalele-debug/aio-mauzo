"use client";

import { MessageCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Conversation } from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";
import { formatRelativeTime } from "@/lib/utils/format";

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
  activeId: number | null;
  onSelect: (id: number) => void;
}

export function ConversationList({ conversations, isLoading, activeId, onSelect }: ConversationListProps) {
  if (isLoading && conversations.length === 0) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="No conversations yet"
        description="Start a new message to reach someone on your team."
      />
    );
  }

  return (
    <ul className="h-full overflow-y-auto">
      {conversations.map((conversation) => {
        const active = conversation.id === activeId;
        const initial = conversation.name.charAt(0).toUpperCase() || "?";

        return (
          <li key={conversation.id}>
            <button
              onClick={() => onSelect(conversation.id)}
              className={cn(
                "flex w-full items-center gap-3 border-b border-[var(--border)] px-4 py-3 text-left transition-colors hover:bg-[var(--neutral-bg)]",
                active && "bg-primary/5",
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--neutral-bg)] text-sm font-semibold text-foreground-muted">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={cn(
                      "truncate text-sm",
                      conversation.unread_count > 0 ? "font-semibold text-foreground" : "font-medium text-foreground",
                    )}
                  >
                    {conversation.name}
                  </p>
                  {conversation.last_message && (
                    <span className="shrink-0 text-[11px] text-foreground-faint">
                      {formatRelativeTime(conversation.last_message.created_at)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-foreground-faint">
                    {conversation.last_message
                      ? `${conversation.last_message.sender_name ? `${conversation.last_message.sender_name}: ` : ""}${conversation.last_message.body}`
                      : "No messages yet"}
                  </p>
                  {conversation.unread_count > 0 && (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                      {conversation.unread_count > 9 ? "9+" : conversation.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
