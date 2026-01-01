package dev.danh.controllers.classteacher;

import dev.danh.entities.dtos.request.classteacher.ClassTeacherCreateRequest;
import dev.danh.entities.dtos.request.classteacher.ClassTeacherUpdateRequest;
import dev.danh.entities.dtos.response.APIResponse;
import dev.danh.services.classteacher.ClassTeacherService;
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
@RequestMapping("/class-teachers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ClassTeacherController {
    ClassTeacherService classTeacherService;

    @GetMapping("/getAll")
    public ResponseEntity<APIResponse> getAll(@RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(APIResponse.builder()
                .message("Class teachers retrieved successfully")
                .data(classTeacherService.getAll(page))
                .statusCode(200)
                .build());
    }

    @GetMapping("/get")
    public ResponseEntity<APIResponse> getById(
            @RequestParam UUID classId,
            @RequestParam UUID teacherId) {
        return ResponseEntity.ok(APIResponse.builder()
                .message("Class teacher retrieved successfully")
                .data(classTeacherService.getById(classId, teacherId))
                .statusCode(200)
                .build());
    }

    @GetMapping("/getByClass/{classId}")
    public ResponseEntity<APIResponse> getByClassId(@PathVariable UUID classId) {
        return ResponseEntity.ok(APIResponse.builder()
                .message("Class teachers retrieved successfully")
                .data(classTeacherService.getByClassId(classId))
                .statusCode(200)
                .build());
    }

    @GetMapping("/getByTeacher/{teacherId}")
    public ResponseEntity<APIResponse> getByTeacherId(@PathVariable UUID teacherId) {
        return ResponseEntity.ok(APIResponse.builder()
                .message("Class teachers retrieved successfully")
                .data(classTeacherService.getByTeacherId(teacherId))
                .statusCode(200)
                .build());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @PostMapping("/create")
    public ResponseEntity<APIResponse> create(@Valid @RequestBody ClassTeacherCreateRequest request) {
        log.info("Creating class teacher: classId={}, teacherId={}",
                request.getClassId(), request.getUsername());
        return ResponseEntity.ok(APIResponse.builder()
                .message("Class teacher created successfully")
                .data(classTeacherService.create(request))
                .statusCode(200)
                .build());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @PutMapping("/update")
    public ResponseEntity<APIResponse> update(
            @RequestParam UUID classId,
            @RequestParam UUID teacherId,
            @Valid @RequestBody ClassTeacherUpdateRequest request) {
        log.info("Updating class teacher: classId={}, teacherId={}", classId, teacherId);
        return ResponseEntity.ok(APIResponse.builder()
                .message("Class teacher updated successfully")
                .data(classTeacherService.update(classId, teacherId, request))
                .statusCode(200)
                .build());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @DeleteMapping("/delete")
    public ResponseEntity<APIResponse> delete(
            @RequestParam UUID classId,
            @RequestParam UUID teacherId) {
        log.info("Deleting class teacher: classId={}, teacherId={}", classId, teacherId);
        return ResponseEntity.ok(APIResponse.builder()
                .message("Class teacher deleted successfully")
                .data(classTeacherService.delete(classId, teacherId))
                .statusCode(200)
                .build());
    }
}

