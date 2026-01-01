package dev.danh.entities.dtos.request.student;


import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentAdminUpdateRequest {
    String avatarUrl;
    String fullName;
    String username;
    Boolean gender;
    String parentPhone;
    String parentName;
    String phoneNumber;
    String address;
    LocalDate dateOfBirth;
    LocalDate dateOfEnrollment;
    Boolean active;
    Boolean deleteAvatar;
}
