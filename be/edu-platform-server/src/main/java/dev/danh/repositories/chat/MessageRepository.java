package dev.danh.repositories.chat;

import dev.danh.entities.documents.Messages;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends MongoRepository<Messages, String> {
    Page<Messages> findByConversationIdOrderByCreatedAtDesc(String conversationId, Pageable pageable);
}
