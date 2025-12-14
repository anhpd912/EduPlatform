package dev.danh.entities.dtos.response;


import dev.danh.entities.models.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    UUID id;
    String avatarUrl;
    String username;
    String password;
    String email;
    String fullName;
    Boolean gender;
    String phoneNumber;
    String address;
    LocalDate dateOfBirth;
    Set<Role> roles;
    Boolean isActive;
    LocalDate createdDate;
    LocalDate updatedDate;
    String authProvider; // Assuming this is a string representation of the AuthProvider enum
}
