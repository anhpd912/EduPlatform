package dev.danh.entities.dtos.request.classsubject;

import dev.danh.enums.ClassSubjectStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClassSubjectUpdateRequest {
    UUID newTeacherId;
    ClassSubjectStatus status;
}
