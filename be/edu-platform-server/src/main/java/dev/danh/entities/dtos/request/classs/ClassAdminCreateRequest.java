package dev.danh.entities.dtos.request.classs;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClassAdminCreateRequest {
    @NotNull(message = "Class name is not null")
    String name;
    String description;
    String homeroomTeacherId;

}
