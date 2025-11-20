package dev.danh.entities.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Student {
    @Id
    UUID id;
    @Column( columnDefinition = "default CURRENT_DATE")
    LocalDate dateOfEnrollment;
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;
}
