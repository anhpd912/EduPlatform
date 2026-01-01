package dev.danh.entities.dtos.response.subject;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectResponse {
    UUID subjectId;
    String subjectCode;
    String subjectName;
    String description;
}

