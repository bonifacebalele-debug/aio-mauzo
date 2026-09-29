"use client";

import { Check, Search, Users as UsersIcon, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useCreateConversation, useUserSearch } from "@/features/chat/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import type { ChatUser } from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/store/toast-store";

interface NewConversationDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: (conversationId: number) => void;
}

export function NewConversationDialog({ open, onClose, onCreated }: NewConversationDialogProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ChatUser[]>([]);
  const [groupName, setGroupName] = useState("");

  const { data: results, isLoading } = useUserSearch(query);
  const createConversation = useCreateConversation();

  const isGroup = selected.length > 1;

  const toggleUser = (user: ChatUser) => {
    setSelected((prev) =>
      prev.some((u) => u.id === user.id) ? prev.filter((u) => u.id !== user.id) : [...prev, user],
    );
  };

  const handleClose = () => {
    setQuery("");
    setSelected([]);
    setGroupName("");
    onClose();
  };

  const handleCreate = async () => {
    if (selected.length === 0) return;

    if (isGroup && !groupName.trim()) {
      toast.error("Give the group a name.");
      return;
    }

    try {
      const conversation = await createConversation.mutateAsync({
        user_ids: selected.map((u) => u.id),
        is_group: isGroup,
        name: isGroup ? groupName.trim() : undefined,
      });
      handleClose();
      onCreated(conversation.id);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="New Message" maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-faint" />
          <Input
            autoFocus
            placeholder="Search people by name or email…"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selected.map((user) => (
              <span
                key={user.id}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {user.name}
                <button type="button" onClick={() => toggleUser(user)} aria-label={`Remove ${user.name}`}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {isGroup && (
          <div>
            <Label htmlFor="group-name">Group name</Label>
            <Input
              id="group-name"
              placeholder="e.g. Finance Team"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
        )}

        <div className="max-h-64 overflow-y-auto rounded-[var(--radius-md)] border border-[var(--border)]">
          {isLoading ? (
            <p className="px-3 py-6 text-center text-sm text-foreground-faint">Searching…</p>
          ) : !results?.length ? (
            <div className="flex flex-col items-center gap-2 px-3 py-6 text-center">
              <UsersIcon className="h-5 w-5 text-foreground-faint" />
              <p className="text-sm text-foreground-faint">
                {query ? "No matching people found." : "Start typing to find people."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {results.map((user) => {
                const isSelected = selected.some((u) => u.id === user.id);

                return (
                  <li key={user.id}>
                    <button
                      type="button"
                      onClick={() => toggleUser(user)}
                      className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--neutral-bg)]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                        <p className="truncate text-xs text-foreground-faint">{user.email}</p>
                      </div>
                      <div
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-[var(--border-strong)]",
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCreate}
            loading={createConversation.isPending}
            disabled={selected.length === 0}
          >
            Start Chat
          </Button>
        </div>
      </div>
    </Modal>
  );
}
