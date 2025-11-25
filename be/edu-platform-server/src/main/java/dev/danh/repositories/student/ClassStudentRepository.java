package dev.danh.repositories.student;

import dev.danh.entities.embedded.ClassSubjectId;
import dev.danh.entities.models.ClassStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassStudentRepository extends JpaRepository<ClassStudent, ClassSubjectId> {
}
