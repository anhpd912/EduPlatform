package dev.danh.entities.models;

import dev.danh.enums.AuthProvider;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;
    @Column(columnDefinition = "default 'https://picsum.photos/200'")
    String avatarUrl;
    @Column(unique = true, nullable = false)
    String username;
    String password;
    @Column(unique = true)
    String email;
    String fullName;
    Boolean gender;
    String phoneNumber;
    String address;
    LocalDate dateOfBirth;
    String resetTokenHash;
    @Column
    Boolean isActive;
    @ManyToMany(fetch = FetchType.EAGER)
    Set<Role> roles;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Student student;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Teacher teacher;

    @Enumerated(EnumType.STRING)
    AuthProvider authProvider = AuthProvider.LOCAL; // Default to local authentication
    @Column(name = "provider_id", nullable = true)
    String providerId; // ID from the external provider (e.g., Google, Facebook) if applicable
}
