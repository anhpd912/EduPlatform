package dev.danh.repositories.student;

import dev.danh.entities.models.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StudentRepository extends JpaRepository<Student, UUID> {
    @Query(value = "SELECT s FROM Student s JOIN FETCH s.user",
            countQuery = "SELECT count(s) FROM Student s")
    Page<Student> findAllWithUser(Pageable pageable);
}
