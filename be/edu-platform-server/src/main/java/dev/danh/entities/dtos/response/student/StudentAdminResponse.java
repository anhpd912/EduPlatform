package dev.danh.entities.dtos.response.student;

import dev.danh.entities.models.*;
import dev.danh.entities.models.Class;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@NotBlank
@Builder
@Getter
@Setter
public class StudentAdminResponse {
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
    LocalDate dateOfEnrollment;
    Boolean isActive;
    LocalDate createdDate;
    LocalDate updatedDate;
    List<Role> roles;
    List<Class> classes;
    List<StudentProgress> studentProgress;
    List<AssignmentSubmission> assignmentSubmissions;
    List<Attendance> attendanceSessions;
    List<ClassStudent> classEnrollments;
    List<ExamResult> examResults;
    List<AttendanceRecord> attendanceRecords;
}
