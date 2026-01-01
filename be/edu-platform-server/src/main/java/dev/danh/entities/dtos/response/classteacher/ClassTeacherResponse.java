package dev.danh.entities.dtos.response.classteacher;

import dev.danh.enums.ClassTeacherEnrollStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClassTeacherResponse {
    UUID classId;
    String className;
    String classCode;
    UUID teacherId;
    String teacherName;
    String teacherEmail;
    ClassTeacherEnrollStatus status;
}
