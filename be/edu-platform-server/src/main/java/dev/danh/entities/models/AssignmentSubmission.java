package dev.danh.entities.models;

import dev.danh.enums.AssignmentGradeStatus;
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
public class AssignmentSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID submissionId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id")
    Assignment assignment;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    Student student;

    LocalDateTime submittedAt;
    String fileUrl;
    String answerText;
    @Column(name = "score", precision = 5, scale = 2)
    BigDecimal score = BigDecimal.valueOf(10.00);
    String feedback;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "graded_by")
    Teacher teacher;
    LocalDateTime gradedAt;
    @Enumerated(EnumType.STRING)
    AssignmentGradeStatus status;

}
