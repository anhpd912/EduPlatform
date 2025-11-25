package dev.danh.entities.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Student {
    @Id
    UUID id;
    @Column( columnDefinition = "default CURRENT_DATE")
    LocalDate dateOfEnrollment;
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;
    @OneToMany(mappedBy = "student")
    private List<StudentProgress> studentProgress;

    @OneToMany(mappedBy = "student")
    private List<AssignmentSubmission> assignmentSubmissions;

    @OneToMany(mappedBy = "student")
    private List<Attendance> attendanceSessions;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<ClassStudent> classEnrollments;
    @OneToMany(mappedBy = "student")
    private List<ExamResult> examResults;
    @OneToMany(mappedBy = "student")
    private List<AttendanceRecord> attendanceRecords;




}
