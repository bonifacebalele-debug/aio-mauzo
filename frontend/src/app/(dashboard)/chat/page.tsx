"use client";

import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { ConversationList } from "@/features/chat/ConversationList";
import { useConversations } from "@/features/chat/hooks";
import { MessageThread } from "@/features/chat/MessageThread";
import { NewConversationDialog } from "@/features/chat/NewConversationDialog";
import { cn } from "@/lib/utils/cn";

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatPageContent />
    </Suspense>
  );
}

function ChatPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: conversations, isLoading } = useConversations();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [showNewDialog, setShowNewDialog] = useState(false);

  useEffect(() => {
    const fromQuery = searchParams.get("conversation");
    if (fromQuery) {
      setActiveId(Number(fromQuery));
    }
  }, [searchParams]);

  const handleSelect = (id: number) => {
    setActiveId(id);
    router.replace(`/chat?conversation=${id}`, { scroll: false });
  };

  const handleBack = () => {
    setActiveId(null);
    router.replace("/chat", { scroll: false });
  };

  const activeConversation = conversations?.find((c) => c.id === activeId) ?? null;

  return (
    <div>
      <PageHeader
        title="Chat"
        description="Message people across the team"
        actions={
          <Button type="button" className="gap-2" onClick={() => setShowNewDialog(true)}>
            <Plus className="h-4 w-4" /> New Message
          </Button>
        }
      />

      <div className="flex h-[70vh] min-h-[420px] max-h-[820px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
        <div
          className={cn(
            "w-full shrink-0 border-r border-[var(--border)] lg:block lg:w-80",
            activeId !== null && "hidden lg:block",
          )}
        >
          <ConversationList
            conversations={conversations ?? []}
            isLoading={isLoading}
            activeId={activeId}
            onSelect={handleSelect}
          />
        </div>

        <div className={cn("flex min-w-0 flex-1 flex-col", activeId === null && "hidden lg:flex")}>
          {activeConversation ? (
            <MessageThread conversation={activeConversation} onBack={handleBack} />
          ) : (
            <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-foreground-faint">
              Select a conversation, or start a new message.
            </div>
          )}
        </div>
      </div>

      <NewConversationDialog
        open={showNewDialog}
        onClose={() => setShowNewDialog(false)}
        onCreated={(conversationId) => {
          setShowNewDialog(false);
          handleSelect(conversationId);
        }}
      />
    </div>
  );
}
