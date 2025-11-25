package dev.danh.entities.models;

import dev.danh.enums.AttendanceStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(
        name = "attendance_record",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"attendance_id", "student_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceRecord {

    @Id
    @Column(name = "attendance_record_id")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "attendance_id", nullable = false)
    private Attendance attendanceSession;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private AttendanceStatus status;  // PRESENT / ABSENT / LATE / EXCUSED

    private String note;
}
