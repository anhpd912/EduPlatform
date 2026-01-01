package dev.danh.services.classsubject;

import dev.danh.entities.dtos.request.classsubject.ClassSubjectCreateRequest;
import dev.danh.entities.dtos.request.classsubject.ClassSubjectUpdateRequest;
import dev.danh.entities.dtos.response.classsubject.ClassSubjectResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface ClassSubjectService {
    Page<ClassSubjectResponse> getAll(int page);
    ClassSubjectResponse getById(UUID classId, UUID subjectId, UUID teacherId);
    List<ClassSubjectResponse> getByClassId(UUID classId);
    List<ClassSubjectResponse> getBySubjectId(UUID subjectId);
    List<ClassSubjectResponse> getByTeacherId(UUID teacherId);
    ClassSubjectResponse create(ClassSubjectCreateRequest request);
    ClassSubjectResponse update(UUID classId, UUID subjectId, UUID teacherId, ClassSubjectUpdateRequest request);
    boolean delete(UUID classId, UUID subjectId, UUID teacherId);
}

