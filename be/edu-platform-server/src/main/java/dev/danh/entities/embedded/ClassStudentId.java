package dev.danh.entities.embedded;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.util.UUID;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassStudentId {
    private UUID classId;
    private UUID studentId;

}
