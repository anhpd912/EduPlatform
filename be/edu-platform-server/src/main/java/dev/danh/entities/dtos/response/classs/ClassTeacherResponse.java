package dev.danh.entities.dtos.response.classs;

import dev.danh.entities.models.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClassTeacherResponse {
    UUID id;
    String name;
    String description;
    UUID homeroomTeacherId;
    String classCode;
    String homeroomTeacherName;
    List<StudentProgress> studentProgresses;
    List<Attendance> attendanceSessions;
    List<Assignment> assignments;
    List<ClassStudent> classEnrollments;
    List<ClassSubject> classSubjects;
    List<Exam> exams;
    List<Timetable> timetables;
}
