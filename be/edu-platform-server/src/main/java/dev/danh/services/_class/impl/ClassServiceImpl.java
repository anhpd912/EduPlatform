package dev.danh.services._class.impl;

import dev.danh.entities.dtos.request.classs.ClassAdminCreateRequest;
import dev.danh.entities.dtos.request.classs.ClassTeacherCreateRequest;
import dev.danh.entities.dtos.request.classs.ClassUpdateRequest;
import dev.danh.entities.dtos.response.classs.ClassResponse;
import dev.danh.entities.dtos.response.classs.ClassTeacherResponse;
import dev.danh.entities.models.Class;
import dev.danh.entities.models.Teacher;
import dev.danh.entities.models.User;
import dev.danh.enums.ClassTeacherEnrollStatus;
import dev.danh.mapper.ClassMapper;
import dev.danh.mapper.ClassTeacherMapper;
import dev.danh.repositories._class.ClassRepository;
import dev.danh.repositories.classteacher.ClassTeacherRepository;
import dev.danh.repositories.teacher.TeacherRepository;
import dev.danh.repositories.user.UserRepository;
import dev.danh.services._class.ClassService;
import dev.danh.services.notification.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ClassServiceImpl implements ClassService {
    ClassRepository classRepository;
    TeacherRepository teacherRepository;
    ClassMapper classMapper;
    ClassTeacherMapper classTeacherMapper;
    NotificationService notificationService;
    ClassTeacherRepository classTeacherRepository;
    private final UserRepository userRepository;

    @Override
    public Page<ClassResponse> getAll(int page) {
        return classRepository.findAll(PageRequest.of(Math.max(0, page - 1), 9)).map(classMapper::toResponse);
    }

    @Override
    public ClassResponse getById(UUID id) {
        return classRepository.findById(id).map(classMapper::toResponse).orElse(null);
    }

    @Override
    public ClassResponse create(ClassAdminCreateRequest request) {
        Class c = Class.builder().name(request.getName()).description(request.getDescription()).build();
        if (request.getHomeroomTeacherId() != null) {
            Optional<Teacher> t = teacherRepository.findById(UUID.fromString(request.getHomeroomTeacherId()));
            t.ifPresent(c::setHomeroomTeacher);
        }


        Class saved = classRepository.save(c);
        return classMapper.toResponse(saved);
    }

    @Override
    public ClassResponse update(UUID id, ClassUpdateRequest request) {
        Optional<Class> optionalClass = classRepository.findById(id);
        if (optionalClass.isEmpty()) return null;
        Class c = optionalClass.get();
        c.setName(request.getName());
        c.setDescription(request.getDescription());
        if (request.getHomeroomTeacherId() != null) {
            Optional<Teacher> t = teacherRepository.findById(UUID.fromString(request.getHomeroomTeacherId()));
            t.ifPresent(c::setHomeroomTeacher);
        }
        Class saved = classRepository.save(c);
        return classMapper.toResponse(saved);
    }

    @Override
    public boolean delete(UUID id) {
        Optional<Class> optionalClass = classRepository.findById(id);
        if (optionalClass.isEmpty()) return false;
        classRepository.deleteById(id);
        return true;
    }

    @Override
    public ClassResponse create(ClassTeacherCreateRequest request, User user) {
        Class c = Class.builder().name(request.getName()).description(request.getDescription()).build();
        if (user != null) {
            Optional<Teacher> t = teacherRepository.findById(user.getId());
            log.info("Setting homeroom teacher for class {}: {}", c.getName(), t);
            t.ifPresent(c::setHomeroomTeacher);
        }
        String classCode = UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        c.setClassCode(classCode);
        Class saved = classRepository.save(c);
        return classMapper.toResponse(saved);
    }

    @Override
    public Page<ClassTeacherResponse> getByTeacher(UUID id, int page) {
        return classRepository.findByTeacherId(id, ClassTeacherEnrollStatus.JOINED, PageRequest.of(page, 9))
                .map(classMapper::toTeacherResponse);
    }


}
