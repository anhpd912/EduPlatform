package dev.danh.entities.models;

import dev.danh.entities.embedded.ClassStudentId;
import dev.danh.enums.ClassStudentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClassStudent {
    @EmbeddedId
    ClassStudentId id;
    @ManyToOne
    @MapsId("classId")
    @JoinColumn(name = "class_id")
    Class _class;
    @ManyToOne
    @MapsId("studentId")
    @JoinColumn(name = "student_id")
    Student student;
    LocalDate dateOfEnrollment;
    @Enumerated(EnumType.STRING)
    ClassStudentStatus status;

}
