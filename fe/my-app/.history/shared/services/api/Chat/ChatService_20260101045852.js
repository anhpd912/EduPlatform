import { privateApi } from "../../axios/AxiosClient";

const BASE_URL = "/api/chat";

export const ChatService = {
  // Get all users for chat
  getAllUsers: async () => {
    return privateApi.get("/api/users/chat-list");
  },

  // Get conversations for current user
  getConversations: async () => {
    return privateApi.get(`${BASE_URL}/conversations`);
  },

  // Get messages with specific user
  getMessages: async (recipientId) => {
    return privateApi.get(`${BASE_URL}/messages/${recipientId}`);
  },

  // Send message
  sendMessage: async (messageData) => {
    return privateApi.post(`${BASE_URL}/send`, messageData);
  },

  // Mark messages as read
  markAsRead: async (senderId) => {
    return privateApi.put(`${BASE_URL}/read/${senderId}`);
  },

  // Get unread count
  getUnreadCount: async () => {
    return privateApi.get(`${BASE_URL}/unread-count`);
  },

  // Delete message
  deleteMessage: async (messageId) => {
    return privateApi.delete(`${BASE_URL}/messages/${messageId}`);
  },

  // Search messages
  searchMessages: async (query) => {
    return privateApi.get(`${BASE_URL}/search`, { params: { query } });
  },
};
