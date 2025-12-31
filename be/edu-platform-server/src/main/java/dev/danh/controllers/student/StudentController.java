package dev.danh.controllers.student;

import dev.danh.entities.dtos.request.student.StudentAdminUpdateRequest;
import dev.danh.entities.dtos.response.APIResponse;
import dev.danh.services.student.StudentService;
import jakarta.servlet.annotation.MultipartConfig;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@MultipartConfig(maxFileSize = 5 * 1024 * 1024) // 5 MB
public class StudentController {
    StudentService studentService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getAll")
    public ResponseEntity<APIResponse> findAll(@RequestParam("page") int page) {
        return ResponseEntity.ok(
                APIResponse.builder()
                        .statusCode(200)
                        .message("Students retrieved successfully")
                        .data(studentService.getAllStudents(page)).build()
        );
    }

    public ResponseEntity<APIResponse> updateStudent(StudentAdminUpdateRequest request) {
        return ResponseEntity.ok(
                APIResponse.builder()
                        .statusCode(200)
                        .message("Students retrieved successfully")
                        .build()
        );
    }
}
