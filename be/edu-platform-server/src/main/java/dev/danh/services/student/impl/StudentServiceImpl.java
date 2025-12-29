package dev.danh.services.student.impl;

import dev.danh.entities.dtos.response.student.StudentAdminResponse;
import dev.danh.mapper.StudentMapper;
import dev.danh.repositories.student.StudentRepository;
import dev.danh.services.student.StudentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StudentServiceImpl implements StudentService {
    StudentRepository studentRepository;
    StudentMapper studentMapper;

    @Override
    public Page<StudentAdminResponse> getAllStudents(int page) {
        return studentRepository.findAllWithUser(PageRequest.of(page - 1, 9)).map(studentMapper::toStudentAdminResponse);
    }
}
