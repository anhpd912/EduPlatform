package dev.danh.entities.dtos.request.subject;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectUpdateRequest {
    String subjectCode;
    String subjectName;
    String description;
}

