package dev.danh.entities.dtos.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String avatarUrl;
    String fullName;
    Boolean gender;
    String phoneNumber;
    String address;
    LocalDate dateOfBirth;
}
