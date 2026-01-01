package dev.danh.controllers.subject;

import dev.danh.entities.dtos.request.subject.SubjectCreateRequest;
import dev.danh.entities.dtos.request.subject.SubjectUpdateRequest;
import dev.danh.entities.dtos.response.APIResponse;
import dev.danh.services.subject.SubjectService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/subjects")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SubjectController {
    SubjectService subjectService;

    @GetMapping("/getAll")
    public ResponseEntity<APIResponse> getAll(@RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(APIResponse.builder()
                .message("Subjects retrieved successfully")
                .data(subjectService.getAll(page))
                .statusCode(200)
                .build());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<APIResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(APIResponse.builder()
                .message("Subject retrieved successfully")
                .data(subjectService.getById(id))
                .statusCode(200)
                .build());
    }

    @GetMapping("/getByCode/{code}")
    public ResponseEntity<APIResponse> getBySubjectCode(@PathVariable String code) {
        return ResponseEntity.ok(APIResponse.builder()
                .message("Subject retrieved successfully")
                .data(subjectService.getBySubjectCode(code))
                .statusCode(200)
                .build());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @PostMapping("/create")
    public ResponseEntity<APIResponse> create(@Valid @RequestBody SubjectCreateRequest request) {
        log.info("Creating subject with code: {}", request.getSubjectCode());
        return ResponseEntity.ok(APIResponse.builder()
                .message("Subject created successfully")
                .data(subjectService.create(request))
                .statusCode(200)
                .build());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @PutMapping("/update/{id}")
    public ResponseEntity<APIResponse> update(@PathVariable UUID id, @Valid @RequestBody SubjectUpdateRequest request) {
        log.info("Updating subject with id: {}", id);
        return ResponseEntity.ok(APIResponse.builder()
                .message("Subject updated successfully")
                .data(subjectService.update(id, request))
                .statusCode(200)
                .build());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<APIResponse> delete(@PathVariable UUID id) {
        log.info("Deleting subject with id: {}", id);
        return ResponseEntity.ok(APIResponse.builder()
                .message("Subject deleted successfully")
                .data(subjectService.delete(id))
                .statusCode(200)
                .build());
    }
}
