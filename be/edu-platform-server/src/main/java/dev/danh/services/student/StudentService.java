package dev.danh.services.student;

import dev.danh.entities.dtos.response.student.StudentAdminResponse;
import org.springframework.data.domain.Page;

public interface StudentService {
    Page<StudentAdminResponse> getAllStudents(int page);
}
