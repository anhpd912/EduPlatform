package dev.danh.entities.dtos.request.auth;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationGoogleRequest {
    String username;        // generated or from email
    String email;           // email
    String provideId;
    String deviceInfo;

}