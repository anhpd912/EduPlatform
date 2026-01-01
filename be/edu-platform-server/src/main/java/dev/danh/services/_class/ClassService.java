package dev.danh.services._class;

import dev.danh.entities.dtos.request.classs.ClassAdminCreateRequest;
import dev.danh.entities.dtos.request.classs.ClassTeacherCreateRequest;
import dev.danh.entities.dtos.request.classs.ClassUpdateRequest;
import dev.danh.entities.dtos.response.classs.ClassResponse;
import dev.danh.entities.dtos.response.classs.ClassTeacherResponse;
import dev.danh.entities.models.User;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface ClassService {
    Page<ClassResponse> getAll(int page);

    ClassResponse getById(UUID id);

    ClassResponse create(ClassAdminCreateRequest request);

    ClassResponse update(UUID id, ClassUpdateRequest request);

    boolean delete(UUID id);

    ClassResponse create(ClassTeacherCreateRequest request, User user);

    Page<ClassTeacherResponse> getByTeacher(UUID id, int page);

}
