package dev.danh.repositories.classteacher;

import dev.danh.entities.embedded.ClassTeacherId;
import dev.danh.entities.models.ClassTeacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClassTeacherRepository extends JpaRepository<ClassTeacher, ClassTeacherId> {
    List<ClassTeacher> findByIdClassId(UUID classId);
    List<ClassTeacher> findByIdTeacherId(UUID teacherId);
    boolean existsById(ClassTeacherId id);
}
