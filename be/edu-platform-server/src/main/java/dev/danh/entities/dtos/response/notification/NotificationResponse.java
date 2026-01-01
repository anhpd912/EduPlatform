package dev.danh.entities.dtos.response.notification;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationResponse {
    Long id;
    String title;
    String message;
    String type;           // CLASS_INVITATION, ASSIGNMENT_CREATED, etc.
    UUID referenceId;      // ID của entity liên quan
    String referenceType;  // CLASS, ASSIGNMENT, EXAM, etc.
    Boolean isRead;
    LocalDateTime createdAt;
    Object metadata;
}
