package dev.danh.services.notification;

import dev.danh.entities.dtos.response.notification.NotificationResponse;
import dev.danh.entities.models.User;
import dev.danh.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface NotificationService {
    void createNotification(User user, String title, String message,
                            NotificationType type, UUID refId, String refType);


    Page<NotificationResponse> getMyNotifications(UUID userId, Pageable pageable);


    Long getUnreadCount(UUID userId);

    void markAsRead(Long notificationId, UUID userId);

    void markAllAsRead(UUID userId);

    void deleteNotification(Long id, UUID id1);
}
