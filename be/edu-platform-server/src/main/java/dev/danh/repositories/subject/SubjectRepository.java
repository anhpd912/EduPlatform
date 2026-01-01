package dev.danh.repositories.subject;

import dev.danh.entities.models.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, UUID> {
    boolean existsBySubjectCode(String subjectCode);
    Optional<Subject> findBySubjectCode(String subjectCode);
}
