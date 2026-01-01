package dev.danh.entities.dtos.request.subject;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectCreateRequest {
    @NotNull(message = "Subject code is required")
    String subjectCode;
    @NotNull(message = "Subject name is required")
    String subjectName;
    String description;
}
