package dev.danh.repositories.auth;

import dev.danh.entities.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role,String> {
}
