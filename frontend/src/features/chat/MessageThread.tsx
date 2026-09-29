"use client";

import { ArrowLeft, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { useMessages, useSendMessage } from "@/features/chat/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import type { Conversation } from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";
import { formatRelativeTime } from "@/lib/utils/format";
import { toast } from "@/store/toast-store";

interface MessageThreadProps {
  conversation: Conversation;
  onBack: () => void;
}

export function MessageThread({ conversation, onBack }: MessageThreadProps) {
  const [body, setBody] = useState("");
  const { data, isLoading } = useMessages(conversation.id);
  const sendMessage = useSendMessage(conversation.id);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [data?.data.length, conversation.id]);

  const handleSend = async () => {
    const trimmed = body.trim();
    if (!trimmed) return;

    setBody("");
    try {
      await sendMessage.mutateAsync(trimmed);
    } catch (error) {
      toast.error(extractErrorMessage(error));
      setBody(trimmed);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
        <button onClick={onBack} className="text-foreground-muted hover:text-foreground lg:hidden" aria-label="Back">
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--neutral-bg)] text-sm font-semibold text-foreground-muted">
          {conversation.name.charAt(0).toUpperCase() || "?"}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{conversation.name}</p>
          {conversation.is_group && (
            <p className="truncate text-xs text-foreground-faint">
              {conversation.participants.map((p) => p.name).join(", ")}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading && !data ? (
          <p className="text-center text-sm text-foreground-faint">Loading messages…</p>
        ) : !data?.data.length ? (
          <p className="text-center text-sm text-foreground-faint">No messages yet — say hello.</p>
        ) : (
          <div className="space-y-3">
            {data.data.map((message) => (
              <div key={message.id} className={cn("flex", message.is_mine ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[75%] rounded-[var(--radius-lg)] px-3.5 py-2",
                    message.is_mine ? "bg-primary text-primary-foreground" : "bg-[var(--neutral-bg)] text-foreground",
                  )}
                >
                  {conversation.is_group && !message.is_mine && (
                    <p className="mb-0.5 text-[11px] font-semibold opacity-70">{message.sender.name}</p>
                  )}
                  <p className="whitespace-pre-wrap break-words text-sm">{message.body}</p>
                  <p
                    className={cn(
                      "mt-1 text-[10px]",
                      message.is_mine ? "text-primary-foreground/70" : "text-foreground-faint",
                    )}
                  >
                    {formatRelativeTime(message.created_at)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-end gap-2 border-t border-[var(--border)] p-3"
      >
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message…"
          className="max-h-32 min-h-10 flex-1 resize-none py-2.5"
          rows={1}
        />
        <Button type="submit" size="icon" disabled={!body.trim() || sendMessage.isPending} aria-label="Send">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
