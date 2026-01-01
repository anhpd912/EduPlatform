package dev.danh.controllers._class;

import dev.danh.entities.dtos.request.classs.ClassTeacherCreateRequest;
import dev.danh.entities.dtos.request.classs.ClassUpdateRequest;
import dev.danh.entities.dtos.response.APIResponse;
import dev.danh.entities.models.User;
import dev.danh.services._class.ClassService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/class")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ClassController {
    ClassService classService;

    @GetMapping("/getAll")
    public ResponseEntity<APIResponse> getAll(@RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(APIResponse.builder()
                .message("Classes retrieved successfully")
                .data(classService.getAll(page))
                .statusCode(200)
                .build());
    }

    @GetMapping("/myClasses")
    public ResponseEntity<APIResponse> getByTeacher(@AuthenticationPrincipal User currentUser, @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(APIResponse.builder()
                .message("Classes retrieved successfully")
                .data(classService.getByTeacher(currentUser.getId(), page))
                .statusCode(200)
                .build());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<APIResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(APIResponse.builder()
                .message("Class retrieved successfully")
                .data(classService.getById(id))
                .statusCode(200)
                .build());
    }

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    @PostMapping("/create")
    public ResponseEntity<APIResponse> create(@Valid @RequestBody ClassTeacherCreateRequest request, @AuthenticationPrincipal User currentUser) {
        log.info("User {} is creating a class with data: {}", currentUser.getId(), request);
        return ResponseEntity.ok(APIResponse.builder()
                .message("Class created successfully")
                .data(classService.create(request, currentUser))
                .statusCode(200)
                .build());
    }

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    @PutMapping("/update/{id}")
    public ResponseEntity<APIResponse> update(@PathVariable UUID id, @Valid @RequestBody ClassUpdateRequest request) {
        return ResponseEntity.ok(APIResponse.builder()
                .message("Class updated successfully")
                .data(classService.update(id, request))
                .statusCode(200)
                .build());
    }

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<APIResponse> delete(@PathVariable UUID id) {
        return ResponseEntity.ok(APIResponse.builder()
                .message("Class deleted successfully")
                .data(classService.delete(id))
                .statusCode(200)
                .build());
    }


}
