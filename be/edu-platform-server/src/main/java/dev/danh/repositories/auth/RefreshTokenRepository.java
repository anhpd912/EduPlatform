package dev.danh.repositories.auth;

import dev.danh.entities.models.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    void deleteByToken(String token);

    Optional<RefreshToken> findByToken(String token);

    List<RefreshToken> findByUserId(UUID userId);
}
