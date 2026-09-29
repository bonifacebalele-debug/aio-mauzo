import { apiClient } from "./client";
import type { ApiResponse, ChatMessage, ChatUser, Conversation, PaginatedResponse } from "./types";

export async function searchUsers(query: string): Promise<ChatUser[]> {
  const { data } = await apiClient.get<ApiResponse<ChatUser[]>>("/users/search", {
    params: { q: query || undefined },
  });

  return data.data;
}

export async function fetchConversations(): Promise<Conversation[]> {
  const { data } = await apiClient.get<ApiResponse<Conversation[]>>("/conversations");

  return data.data;
}

export interface CreateConversationPayload {
  user_ids: number[];
  is_group?: boolean;
  name?: string;
}

export async function createConversation(payload: CreateConversationPayload): Promise<Conversation> {
  const { data } = await apiClient.post<ApiResponse<Conversation>>("/conversations", payload);

  return data.data;
}

export async function fetchMessages(conversationId: number, page = 1): Promise<PaginatedResponse<ChatMessage>> {
  const { data } = await apiClient.get<PaginatedResponse<ChatMessage>>(`/conversations/${conversationId}/messages`, {
    params: { page, per_page: 30 },
  });

  return data;
}

export async function sendMessage(conversationId: number, body: string): Promise<ChatMessage> {
  const { data } = await apiClient.post<ApiResponse<ChatMessage>>(`/conversations/${conversationId}/messages`, {
    body,
  });

  return data.data;
}
