import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createConversation,
  fetchConversations,
  fetchMessages,
  searchUsers,
  sendMessage,
  type CreateConversationPayload,
} from "@/lib/api/chat";

// Real-time push (WebSockets) isn't available on this host, so new
// conversations/messages/notifications arrive via polling instead — a
// 10s interval keeps things feeling responsive without hammering the API.
const POLL_INTERVAL = 10_000;

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
    refetchInterval: POLL_INTERVAL,
    placeholderData: (prev) => prev,
  });
}

export function useMessages(conversationId: number | null) {
  return useQuery({
    queryKey: ["conversations", conversationId, "messages"],
    queryFn: () => fetchMessages(conversationId as number),
    enabled: conversationId !== null,
    refetchInterval: conversationId !== null ? POLL_INTERVAL : false,
    placeholderData: (prev) => prev,
  });
}

export function useUserSearch(query: string) {
  return useQuery({
    queryKey: ["users", "search", query],
    queryFn: () => searchUsers(query),
    staleTime: 15_000,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateConversationPayload) => createConversation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useSendMessage(conversationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: string) => sendMessage(conversationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations", conversationId, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
