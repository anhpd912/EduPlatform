package dev.danh.entities.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "refresh_token")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {
    @Id
    String token;
    @NonNull
    @Column(name = "user_id")
    UUID userId;
    @NonNull
    @Column(name = "expiry_date")
    Date expiryDate;
    @Column(name = "device_info")
    String deviceInfo;
    String ipAddress;
    String location;

}
