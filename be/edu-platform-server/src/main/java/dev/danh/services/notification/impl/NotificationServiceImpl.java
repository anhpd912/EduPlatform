package dev.danh.services.notification.impl;

import dev.danh.entities.dtos.response.notification.NotificationResponse;
import dev.danh.entities.models.Notification;
import dev.danh.entities.models.User;
import dev.danh.enums.NotificationType;
import dev.danh.mapper.NotificationMapper;
import dev.danh.repositories.notification.NotificationRepository;
import dev.danh.services.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate; // WebSocket
    private final NotificationMapper notificationMapper;

    @Override
    public void createNotification(User user, String title, String message,
                                   NotificationType type, UUID refId, String refType) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReferenceId(refId);
        notification.setReferenceType(refType);

        notificationRepository.save(notification);

        // Gửi realtime qua WebSocket
        messagingTemplate.convertAndSendToUser(
                user.getUsername(),
                "/queue/notifications",
                notificationMapper.toResponse(notification)
        );
    }

    public Page<NotificationResponse> getMyNotifications(UUID userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(notificationMapper::toResponse);
    }

    @Override
    public Long getUnreadCount(UUID userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Override
    public void markAsRead(Long notificationId, UUID userId) {

        notificationRepository.markAsRead(notificationId, userId);
    }

    @Override
    public void markAllAsRead(UUID userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }

    @Transactional
    @Override
    public void deleteNotification(Long id, UUID id1) {
        notificationRepository.deleteById(id);
    }

}
