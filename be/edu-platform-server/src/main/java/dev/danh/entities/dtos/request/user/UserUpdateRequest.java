package dev.danh.entities.dtos.request.user;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String avatarUrl;
    String username;
    String fullName;
    Boolean gender;
    String phoneNumber;
    String address;
    LocalDate dateOfBirth;
    Boolean deleteAvatar;
}
