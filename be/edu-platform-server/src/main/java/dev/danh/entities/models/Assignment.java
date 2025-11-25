package dev.danh.entities.models;

import dev.danh.enums.AssignmentType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID assignmentId;
    String title;
    String description;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    Subject subject;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    Teacher teacher;

    @ManyToOne
    @JoinColumn(name = "class_id")
    Class _class;
    @Enumerated(EnumType.STRING)
    AssignmentType assignmentType;
    @Column(name = "total_score", precision = 5, scale = 2)
    BigDecimal totalScore = BigDecimal.valueOf(10.00);
    LocalDateTime startAt;
    LocalDateTime dueAt;
    Boolean allowLate;
    @CreationTimestamp
    LocalDateTime createdAt ;
    @UpdateTimestamp
    LocalDateTime updatedAt ;
    @OneToMany(mappedBy = "assignment")
    List<AssignmentSubmission> assignmentSubmissions;



}
