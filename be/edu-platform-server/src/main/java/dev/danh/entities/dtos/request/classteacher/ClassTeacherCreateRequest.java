package dev.danh.entities.dtos.request.classteacher;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClassTeacherCreateRequest {
    @NotNull(message = "Class ID is required")
    UUID classId;
    @NotNull(message = "Teacher username is required")
    String username;
}
