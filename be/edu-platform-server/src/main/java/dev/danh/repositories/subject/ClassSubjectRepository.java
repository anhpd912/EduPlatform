package dev.danh.repositories.subject;

import dev.danh.entities.embedded.ClassSubjectId;
import dev.danh.entities.models.ClassSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassSubjectRepository extends JpaRepository<ClassSubject, ClassSubjectId> {
}
