package dev.danh.entities.models;

import dev.danh.entities.embedded.ClassSubjectId;
import dev.danh.enums.ClassSubjectStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClassSubject {
    @EmbeddedId
    ClassSubjectId id;
    @ManyToOne
    @MapsId("classId")
    @JoinColumn(name = "class_id")
    Class _class;
    @ManyToOne
    @MapsId("subjectId")
    @JoinColumn(name = "subject_id")
    Subject subject;
    @ManyToOne
    @MapsId("teacherId")
    @JoinColumn(name = "teacher_id")
    Teacher teacher;
    @Enumerated(EnumType.STRING)
    ClassSubjectStatus status;
}
