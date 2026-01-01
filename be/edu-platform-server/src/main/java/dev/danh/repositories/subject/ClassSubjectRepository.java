package dev.danh.repositories.subject;

import dev.danh.entities.embedded.ClassSubjectId;
import dev.danh.entities.models.ClassSubject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClassSubjectRepository extends JpaRepository<ClassSubject, ClassSubjectId> {
    Page<ClassSubject> findByIdClassId(UUID classId, PageRequest pageRequest);
    Page<ClassSubject> findByIdSubjectId(UUID subjectId, PageRequest pageRequest);
    Page<ClassSubject> findByIdTeacherId(UUID teacherId, PageRequest pageRequest);
    List<ClassSubject> findByIdClassId(UUID classId);
    List<ClassSubject> findByIdSubjectId(UUID subjectId);
    List<ClassSubject> findByIdTeacherId(UUID teacherId);
    boolean existsById(ClassSubjectId id);
}
