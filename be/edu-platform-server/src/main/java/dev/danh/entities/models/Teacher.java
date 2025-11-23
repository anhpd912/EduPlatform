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
public class Teacher {
    @Id
    UUID id;
    String expertise;
    @Column( columnDefinition = "default CURRENT_DATE")
    LocalDate dateOfJoining;
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

}
