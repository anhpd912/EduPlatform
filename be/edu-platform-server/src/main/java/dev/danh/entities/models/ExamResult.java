package dev.danh.entities.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamResult {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "exam_result_id")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "score", precision = 5, scale = 2)
    private BigDecimal score;

    @Lob
    private String feedback;

    LocalDateTime gradedAt = LocalDateTime.now();

}
