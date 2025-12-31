package dev.danh.entities.dtos.request.auth;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CompleteRegisterRequest {
    UUID userId;
    String roleName;
}
