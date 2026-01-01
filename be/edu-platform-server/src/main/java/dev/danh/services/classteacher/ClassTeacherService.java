package dev.danh.services.classteacher;

import dev.danh.entities.dtos.request.classteacher.ClassTeacherCreateRequest;
import dev.danh.entities.dtos.request.classteacher.ClassTeacherUpdateRequest;
import dev.danh.entities.dtos.response.classteacher.ClassTeacherResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface ClassTeacherService {
    Page<ClassTeacherResponse> getAll(int page);
    ClassTeacherResponse getById(UUID classId, UUID teacherId);
    List<ClassTeacherResponse> getByClassId(UUID classId);
    List<ClassTeacherResponse> getByTeacherId(UUID teacherId);
    ClassTeacherResponse create(ClassTeacherCreateRequest request);
    ClassTeacherResponse update(UUID classId, UUID teacherId, ClassTeacherUpdateRequest request);
    boolean delete(UUID classId, UUID teacherId);
}

