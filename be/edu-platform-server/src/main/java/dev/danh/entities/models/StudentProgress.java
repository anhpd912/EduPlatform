package dev.danh.entities.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID studentProgressId;

    @ManyToOne
    @JoinColumn(name = "student_id")
    Student student;

    @ManyToOne
    @JoinColumn(name = "class_id")
    Class _class;
    @Column(name = "overall_score", precision = 5, scale = 2)
    BigDecimal overall_score;
    @Column(name = "attendance_rate", precision = 5, scale = 2)
    BigDecimal attendance_rate;
    LocalDateTime last_calculated;

}
