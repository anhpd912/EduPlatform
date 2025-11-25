package dev.danh.entities.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity(name = "timetable_entry")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Timetable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "timetable_id")
    private UUID timetable_id;
    @Column(name = "day_of_week")

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;
    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;
    @ManyToOne
    @JoinColumn(name = "class_id")
    private Class _class;

    private String dayOfWeek;
    @Column(name = "start_time")
    private String startTime;
    @Column(name = "end_time")
    private String endTime;
    String room;
    @Lob
    String note;


}
