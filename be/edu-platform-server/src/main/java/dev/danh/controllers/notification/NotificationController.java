package dev.danh.controllers.notification;

import dev.danh.entities.dtos.response.APIResponse;
import dev.danh.entities.models.User;
import dev.danh.services.notification.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {

    NotificationService notificationService;

    @GetMapping("/my")
    public ResponseEntity<APIResponse> getMyNotifications(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Getting notifications for user: {}", user.getId());
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(
                APIResponse.builder()
                        .message("Notifications retrieved successfully")
                        .data(notificationService.getMyNotifications(user.getId(), pageable))
                        .statusCode(200)
                        .build()
        );
    }

    @GetMapping("/unread-count")
    public ResponseEntity<APIResponse> getUnreadCount(@AuthenticationPrincipal User user) {
        log.info("Getting unread count for user: {}", user.getId());
        return ResponseEntity.ok(APIResponse.builder()
                .message("Unread notification count retrieved successfully")
                .data(notificationService.getUnreadCount(user.getId()))
                .statusCode(200)
                .build());
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<APIResponse> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        log.info("Marking notification {} as read for user: {}", id, user.getId());
        notificationService.markAsRead(id, user.getId());
        return ResponseEntity.ok(
                APIResponse.builder()
                        .message("Notification marked as read successfully")
                        .statusCode(200)
                        .build()
        );
    }

    @PutMapping("/read-all")
    public ResponseEntity<APIResponse> markAllAsRead(@AuthenticationPrincipal User user) {
        log.info("Marking all notifications as read for user: {}", user.getId());
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok(APIResponse.builder()
                .message("Notification all marked as read successfully")
                .statusCode(200)
                .build()
        );
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse> deleteNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        log.info("Deleting notification {} for user: {}", id, user.getId());
        notificationService.deleteNotification(id, user.getId());
        return ResponseEntity.ok(
                APIResponse.builder()
                        .message("Notification deleted successfully")
                        .statusCode(200)
                        .build()
        );
    }
}
