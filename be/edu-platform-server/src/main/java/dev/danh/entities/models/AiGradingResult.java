package dev.danh.entities.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ai_grading_result")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiGradingResult {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ai_result_id", columnDefinition = "BINARY(16)")
    private UUID aiResultId;

    @OneToOne
    @JoinColumn(name = "submissionId")
    private AssignmentSubmission submission;

    @Column(name = "ai_score")
    private BigDecimal aiScore;

    @Column(name = "ai_feedback", columnDefinition = "TEXT")
    private String aiFeedback;

    @Column(name = "raw_response", columnDefinition = "json")
    private String rawResponse;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}