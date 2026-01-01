package dev.danh.entities.dtos.request.classsubject;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClassSubjectCreateRequest {
    @NotNull(message = "Class ID is required")
    UUID classId;
    @NotNull(message = "Subject ID is required")
    UUID subjectId;
    @NotNull(message = "Teacher ID is required")
    UUID teacherId;

}
