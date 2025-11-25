package dev.danh.entities.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID subjectId;
    @Column(nullable = false, unique = true)
    String subjectCode;
    String subjectName;
    String description;

    @OneToMany(mappedBy = "subject")
    private List<Assignment> assignments;

    @OneToMany(mappedBy = "subject")
    private List<ClassSubject> classSubjects;
    @OneToMany(mappedBy = "subject")
    private List<Exam> exams;
    @OneToMany(mappedBy = "subject")
    private List<Timetable> timetables;




}
