package dev.danh.entities.models;

import dev.danh.entities.embedded.ClassTeacherId;
import dev.danh.enums.ClassTeacherEnrollStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClassTeacher {
    @EmbeddedId
    ClassTeacherId id;
    @ManyToOne
    @MapsId("classId")
    @JoinColumn(name = "class_id")
    Class _class;
    @ManyToOne
    @MapsId("teacherId")
    @JoinColumn(name = "teacher_id")
    Teacher teacher;
    @Enumerated(EnumType.STRING)
    ClassTeacherEnrollStatus status;

}
