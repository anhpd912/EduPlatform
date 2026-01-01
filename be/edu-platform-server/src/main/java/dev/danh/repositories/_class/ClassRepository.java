package dev.danh.repositories._class;

import dev.danh.entities.models.Class;
import dev.danh.enums.ClassTeacherEnrollStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ClassRepository extends JpaRepository<Class, UUID> {
    Page<Class> findByHomeroomTeacherId(UUID homeroomTeacherId, Pageable pageable);

    @Query("""
        SELECT DISTINCT c FROM Clazz c
        LEFT JOIN c.classTeachers ct
        WHERE c.homeroomTeacher.id = :teacherId
           OR (ct.teacher.id = :teacherId AND ct.status = :joinedStatus)
        """)
    Page<Class> findByTeacherId(@Param("teacherId") UUID teacherId,
                                 @Param("joinedStatus") ClassTeacherEnrollStatus joinedStatus,
                                 Pageable pageable);
}
