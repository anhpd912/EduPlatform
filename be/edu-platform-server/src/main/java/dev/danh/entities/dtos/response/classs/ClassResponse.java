package dev.danh.entities.dtos.response.classs;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClassResponse {
    UUID id;
    String name;
    String classCode;
    String description;
    UUID homeroomTeacherId;
    String homeroomTeacherName;
}
