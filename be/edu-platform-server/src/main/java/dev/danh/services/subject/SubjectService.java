package dev.danh.services.subject;

import dev.danh.entities.dtos.request.subject.SubjectCreateRequest;
import dev.danh.entities.dtos.request.subject.SubjectUpdateRequest;
import dev.danh.entities.dtos.response.subject.SubjectResponse;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface SubjectService {
    Page<SubjectResponse> getAll(int page);
    SubjectResponse getById(UUID id);
    SubjectResponse getBySubjectCode(String subjectCode);
    SubjectResponse create(SubjectCreateRequest request);
    SubjectResponse update(UUID id, SubjectUpdateRequest request);
    boolean delete(UUID id);
}
