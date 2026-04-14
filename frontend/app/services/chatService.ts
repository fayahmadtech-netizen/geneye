import { apiClient } from "./apiLayer";
import { ChatSession, ChatSessionCreate, ChatMessage, ChatMessageCreate } from "../types/chat";

export const chatService = {
  getSessions: async (): Promise<ChatSession[]> => {
    const response = await apiClient.get<ChatSession[]>("/chat/sessions");
    return response.data;
  },

  createSession: async (data: ChatSessionCreate): Promise<ChatSession> => {
    const response = await apiClient.post<ChatSession>("/chat/sessions", data);
    return response.data;
  },

  getMessages: async (sessionId: string): Promise<ChatMessage[]> => {
    const response = await apiClient.get<ChatMessage[]>(`/chat/sessions/${sessionId}/messages`);
    return response.data;
  },

  sendMessage: async (sessionId: string, data: ChatMessageCreate): Promise<ChatMessage[]> => {
    const response = await apiClient.post<ChatMessage[]>(`/chat/sessions/${sessionId}/messages`, data);
    return response.data;
  }
};
