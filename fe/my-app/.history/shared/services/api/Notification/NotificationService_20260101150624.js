import { privateApi } from "../../axios/AxiosClient";

export const NotificationService = {
  // Get all notifications for current user
  getMyNotifications: (page = 0, size = 10) => {
    return privateApi.get(`/notifications/my?page=${page}&size=${size}`);
  },

  // Get unread notifications count
  getUnreadCount: () => {
    return privateApi.get("/notifications/unread-count");
  },

  // Mark notification as read
  markAsRead: (notificationId) => {
    return privateApi.put(`/notifications/${notificationId}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: () => {
    return privateApi.put("/notifications/read-all");
  },

  // Accept class invitation
  acceptInvitation: (notificationId) => {
    return privateApi.post(`/notifications/${notificationId}/accept`);
  },

  // Decline class invitation
  declineInvitation: (notificationId) => {
    return privateApi.post(`/notifications/${notificationId}/decline`);
  },

  // Delete notification
  deleteNotification: (notificationId) => {
    return privateApi.delete(`/notifications/${notificationId}`);
  },
};
