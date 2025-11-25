package dev.danh.repositories._class;

import dev.danh.entities.models.Class;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
public interface ClassRepository extends JpaRepository<Class, UUID> {
}
