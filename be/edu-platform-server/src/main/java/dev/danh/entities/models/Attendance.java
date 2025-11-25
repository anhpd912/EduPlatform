package dev.danh.entities.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(
        name = "attendance_session",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"class_id", "subject_id", "session_date", "lesson_index"}
                )
        }
)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID attendanceId;
    @ManyToOne
    @JoinColumn(name = "student_id")
    Student student;
    @ManyToOne
    @JoinColumn(name = "class_id")
    Class _class;
    @ManyToOne
    @JoinColumn(name = "teacher_id")
    Teacher teacher;
    @Temporal(TemporalType.DATE)
    @Column(name = "session_date")
    private LocalDate sessionDate;

    @Column(name = "lesson_index")
    private Integer lessonIndex;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "attendanceSession", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AttendanceRecord> records;

}
