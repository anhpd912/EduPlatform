package dev.danh.entities.models;

import dev.danh.enums.ExamType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "exam")
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "exam_id")
    UUID id;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    Class _class;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    Subject subject;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    Teacher teacher;

    @Column(nullable = false)
    String title;

    @Lob
    String description;

    @Column(name = "exam_type", length = 50)
    @Enumerated(EnumType.STRING)
    ExamType examType = ExamType.QUIZ;

    @Column(name = "exam_date", nullable = false)
    LocalDate examDate;

    @Column(name = "start_time")
    LocalTime startTime;

    @Column(name = "end_time")
    LocalTime endTime;

    @Column(name = "total_score", precision = 5, scale = 2)
    BigDecimal totalScore = BigDecimal.valueOf(10.00);
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}
