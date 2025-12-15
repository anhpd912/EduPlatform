package dev.danh.entities.dtos.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationRequest {
    String username;
    String password;
    Boolean rememberMe;
    String deviceInfo;
    String ipAddress;
    String location;
}
