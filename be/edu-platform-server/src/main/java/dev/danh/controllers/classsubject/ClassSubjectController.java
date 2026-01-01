package dev.danh.controllers.classsubject;

import dev.danh.entities.dtos.request.classsubject.ClassSubjectCreateRequest;
import dev.danh.entities.dtos.request.classsubject.ClassSubjectUpdateRequest;
import dev.danh.entities.dtos.response.APIResponse;
import dev.danh.services.classsubject.ClassSubjectService;
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
@RequestMapping("/class-subjects")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ClassSubjectController {
    ClassSubjectService classSubjectService;

    @GetMapping("/getAll")
    public ResponseEntity<APIResponse> getAll(@RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(APIResponse.builder()
                .message("Class subjects retrieved successfully")
                .data(classSubjectService.getAll(page))
                .statusCode(200)
                .build());
    }

    @GetMapping("/get")
    public ResponseEntity<APIResponse> getById(
            @RequestParam UUID classId,
            @RequestParam UUID subjectId,
            @RequestParam UUID teacherId) {
        return ResponseEntity.ok(APIResponse.builder()
                .message("Class subject retrieved successfully")
                .data(classSubjectService.getById(classId, subjectId, teacherId))
                .statusCode(200)
                .build());
    }

    @GetMapping("/getByClass/{classId}")
    public ResponseEntity<APIResponse> getByClassId(@PathVariable UUID classId) {
        return ResponseEntity.ok(APIResponse.builder()
                .message("Class subjects retrieved successfully")
                .data(classSubjectService.getByClassId(classId))
                .statusCode(200)
                .build());
    }

    @GetMapping("/getBySubject/{subjectId}")
    public ResponseEntity<APIResponse> getBySubjectId(@PathVariable UUID subjectId) {
        return ResponseEntity.ok(APIResponse.builder()
                .message("Class subjects retrieved successfully")
                .data(classSubjectService.getBySubjectId(subjectId))
                .statusCode(200)
                .build());
    }

    @GetMapping("/getByTeacher/{teacherId}")
    public ResponseEntity<APIResponse> getByTeacherId(@PathVariable UUID teacherId) {
        return ResponseEntity.ok(APIResponse.builder()
                .message("Class subjects retrieved successfully")
                .data(classSubjectService.getByTeacherId(teacherId))
                .statusCode(200)
                .build());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @PostMapping("/create")
    public ResponseEntity<APIResponse> create(@Valid @RequestBody ClassSubjectCreateRequest request) {
        log.info("Creating class subject: classId={}, subjectId={}, teacherId={}",
                request.getClassId(), request.getSubjectId(), request.getTeacherId());
        return ResponseEntity.ok(APIResponse.builder()
                .message("Class subject created successfully")
                .data(classSubjectService.create(request))
                .statusCode(200)
                .build());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @PutMapping("/update")
    public ResponseEntity<APIResponse> update(
            @RequestParam UUID classId,
            @RequestParam UUID subjectId,
            @RequestParam UUID teacherId,
            @Valid @RequestBody ClassSubjectUpdateRequest request) {
        log.info("Updating class subject: classId={}, subjectId={}, teacherId={}", classId, subjectId, teacherId);
        return ResponseEntity.ok(APIResponse.builder()
                .message("Class subject updated successfully")
                .data(classSubjectService.update(classId, subjectId, teacherId, request))
                .statusCode(200)
                .build());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @DeleteMapping("/delete")
    public ResponseEntity<APIResponse> delete(
            @RequestParam UUID classId,
            @RequestParam UUID subjectId,
            @RequestParam UUID teacherId) {
        log.info("Deleting class subject: classId={}, subjectId={}, teacherId={}", classId, subjectId, teacherId);
        return ResponseEntity.ok(APIResponse.builder()
                .message("Class subject deleted successfully")
                .data(classSubjectService.delete(classId, subjectId, teacherId))
                .statusCode(200)
                .build());
    }
}

