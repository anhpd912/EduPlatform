package dev.danh.entities.dtos.request.classteacher;

import dev.danh.enums.ClassTeacherEnrollStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClassTeacherUpdateRequest {
    ClassTeacherEnrollStatus status;
}

