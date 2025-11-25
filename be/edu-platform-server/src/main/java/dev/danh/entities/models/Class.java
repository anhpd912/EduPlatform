package dev.danh.entities.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity(name = "class")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Class {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "class_id", nullable = false)
    private UUID id;
    @Column(name = "class_name", nullable = false)
    private String name;
    @Column(name = "class_description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "homeroom_teacher_id")
    private Teacher homeroomTeacher;

    @OneToMany(mappedBy = "_class")
    private List<StudentProgress> studentProgresses;
    @OneToMany(mappedBy = "_class")
    private List<Attendance> attendanceSessions;
    @OneToMany(mappedBy = "_class")
    private List<Assignment> assignments;

    @OneToMany(mappedBy = "_class")
    private List<ClassStudent> classEnrollments;
    @OneToMany(mappedBy = "_class")
    private List<ClassSubject> classSubjects;
    @OneToMany(mappedBy = "_class")
    private List<Exam> exams;
    @OneToMany(mappedBy = "_class")
    private List<Timetable> timetables;






}
