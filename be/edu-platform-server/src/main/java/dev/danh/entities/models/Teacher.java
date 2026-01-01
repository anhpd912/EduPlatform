package dev.danh.entities.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity(name = "teacher")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Teacher {
    @Id
    UUID id;
    String expertise;
    @Column
    @CreationTimestamp
    LocalDate dateOfJoining;
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    User user;
    @OneToMany(mappedBy = "homeroomTeacher")
    List<Class> classes;

    @OneToMany(mappedBy = "teacher")
    List<AssignmentSubmission> assignmentSubmissions;

    @OneToMany(mappedBy = "teacher")
    List<Attendance> attendanceSessions;

    @OneToMany(mappedBy = "teacher")
    List<Assignment> assignments;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    private List<ClassSubject> classSubjects;
    @OneToMany(mappedBy = "teacher")
    private List<Exam> exams;
    @OneToMany(mappedBy = "teacher")
    private List<Timetable> timetables;
    @OneToMany(mappedBy = "teacher")
    private List<ClassTeacher> classTeachers;

}
