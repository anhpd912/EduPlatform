package dev.danh.entities.dtos.request.user;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreateRequest {
    @NotNull(message = "NULL_INPUT")
    String username;
    @NotNull(message = "NULL_INPUT")
    @Length(min = 8, message = "LENGTH_PASSWORD")
    String password;
    @NotNull(message = "NULL_INPUT")
    String fullName;
    @NotNull(message = "NULL_INPUT")
    Boolean gender;
    @NotNull(message = "NULL_INPUT")
    String phoneNumber;
    @NotNull(message = "NULL_INPUT")
    String address;
    String role; //Either TEACHER or STUDENT
    LocalDate dateOfBirth;
    @NotNull(message = "NULL_INPUT")
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$", message = "INVALID_EMAIL")
    String email;
    Boolean isActive = true;
    String providerId; // ID from the external provider (e.g., Google, Facebook) if applicable

    TeacherInfo teacherInfo;
    StudentInfo studentInfo;
}
