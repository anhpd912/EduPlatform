package dev.danh.entities.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationResponse {
    String accessToken;
    Boolean authenticated;
    UserResponse userResponse;
    String refreshToken;
    Long refreshTokenDuration;
}
