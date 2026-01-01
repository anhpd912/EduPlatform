package dev.danh.entities.models;

import dev.danh.enums.AuthProvider;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "user")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;
    @Column
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
    @CreationTimestamp
    LocalDate createdDate;
    @UpdateTimestamp
    LocalDate updatedDate;
    @Column
    Boolean isActive = true;
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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
