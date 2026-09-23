import { apiClient } from "./client";
import { AppNotification } from "@/types";

export interface NotificationsResponse {
  unread_count: number;
  notifications: AppNotification[];
}

export const notificationApi = {
  getNotifications: (userId: string = "adv-001") =>
    apiClient<NotificationsResponse>(`/notifications?user_id=${encodeURIComponent(userId)}`),
  
  markRead: (notifId: string, userId: string = "adv-001") =>
    apiClient<{ status: string; id: string }>(`/notifications/${notifId}/read?user_id=${encodeURIComponent(userId)}`, {
      method: "PATCH",
    }),
  
  markAllRead: (userId: string = "adv-001") =>
    apiClient<{ status: string; marked_count: number }>(`/notifications/read-all?user_id=${encodeURIComponent(userId)}`, {
      method: "POST",
    }),
};
