package dev.danh.entities.dtos.request.student;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentCreateRequest {
    @NotBlank(message = "Username is required")
    String username;
    @NotBlank(message = "Password is required")
    String password;
    @NotBlank(message = "Email is required")
    @Pattern(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Invalid email format")
    String email;
    String fullName;
    Boolean gender;
    @Pattern(regexp = "^\\d{10}$", message = "Invalid phone number format")
    String phoneNumber;
    String address;
    LocalDate dateOfBirth;
    LocalDate dateOfEnrollment;
}
