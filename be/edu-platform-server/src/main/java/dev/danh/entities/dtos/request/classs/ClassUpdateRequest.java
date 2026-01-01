package dev.danh.entities.dtos.request.classs;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClassUpdateRequest {
    @NotNull(message = "NULL_INPUT")
    String name;
    String description;
    String homeroomTeacherId;
}
