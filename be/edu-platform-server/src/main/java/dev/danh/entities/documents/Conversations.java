package dev.danh.entities.documents;

import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "conversations")
public class Conversations {
    @Id
    private String id;

    @Indexed // Index mảng participants giúp tìm các phòng chat của 1 user cực nhanh
    private List<String> participants;

    private boolean isGroup; // Để mở rộng chat nhóm sau này (ví dụ cả lớp chat)

    private String conversationName; // Tên nhóm (nếu là chat 1-1 thì có thể để null)

    // Nhúng tin nhắn cuối để FE không cần query bảng Message khi hiện danh sách phòng
    private LastMessage lastMessage;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Data
    public static class LastMessage {
        private String content;
        private String senderId;
        private LocalDateTime timestamp;
    }
}
