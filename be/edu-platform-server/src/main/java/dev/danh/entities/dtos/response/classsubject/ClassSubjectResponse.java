package dev.danh.entities.dtos.response.classsubject;

import dev.danh.enums.ClassSubjectStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClassSubjectResponse {
    UUID classId;
    String className;
    UUID subjectId;
    String subjectName;
    String subjectCode;
    UUID teacherId;
    String teacherName;
    ClassSubjectStatus status;
}

