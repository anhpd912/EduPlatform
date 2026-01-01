package dev.danh.entities.documents;

import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "messages")
public class Messages {
    @Id
    private String id;

    @Indexed // Bắt buộc index để load lịch sử chat nhanh
    private String conversationId;

    private String senderId;

    private String content;

    private MessageType type; // TEXT, IMAGE, FILE, VIDEO

    private MessageStatus status; // SENT, DELIVERED, SEEN

    private LocalDateTime createdAt = LocalDateTime.now();
}

enum MessageType {
    TEXT, IMAGE, FILE, VIDEO
}

enum MessageStatus {
    SENT, DELIVERED, SEEN
}


