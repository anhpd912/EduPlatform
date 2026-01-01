package dev.danh.services.classteacher.impl;

import dev.danh.entities.dtos.request.classteacher.ClassTeacherCreateRequest;
import dev.danh.entities.dtos.request.classteacher.ClassTeacherUpdateRequest;
import dev.danh.entities.dtos.response.classteacher.ClassTeacherResponse;
import dev.danh.entities.embedded.ClassTeacherId;
import dev.danh.entities.models.Class;
import dev.danh.entities.models.ClassTeacher;
import dev.danh.entities.models.Teacher;
import dev.danh.entities.models.User;
import dev.danh.enums.ClassTeacherEnrollStatus;
import dev.danh.enums.ErrorCode;
import dev.danh.enums.NotificationType;
import dev.danh.exception.AppException;
import dev.danh.mapper.ClassTeacherMapper;
import dev.danh.repositories._class.ClassRepository;
import dev.danh.repositories.classteacher.ClassTeacherRepository;
import dev.danh.repositories.teacher.TeacherRepository;
import dev.danh.repositories.user.UserRepository;
import dev.danh.services.classteacher.ClassTeacherService;
import dev.danh.services.notification.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ClassTeacherServiceImpl implements ClassTeacherService {
    ClassTeacherRepository classTeacherRepository;
    ClassRepository classRepository;
    TeacherRepository teacherRepository;
    ClassTeacherMapper classTeacherMapper;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    public Page<ClassTeacherResponse> getAll(int page) {
        return classTeacherRepository.findAll(PageRequest.of(Math.max(0, page - 1), 9))
                .map(classTeacherMapper::toResponse);
    }

    @Override
    public ClassTeacherResponse getById(UUID classId, UUID teacherId) {
        ClassTeacherId id = new ClassTeacherId(classId, teacherId);
        return classTeacherRepository.findById(id)
                .map(classTeacherMapper::toResponse)
                .orElseThrow(() -> new AppException(ErrorCode.CLASS_TEACHER_NOT_FOUND));
    }

    @Override
    public List<ClassTeacherResponse> getByClassId(UUID classId) {
        return classTeacherRepository.findByIdClassId(classId)
                .stream()
                .map(classTeacherMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ClassTeacherResponse> getByTeacherId(UUID teacherId) {
        return classTeacherRepository.findByIdTeacherId(teacherId)
                .stream()
                .map(classTeacherMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ClassTeacherResponse create(ClassTeacherCreateRequest request) {
        // Check if class exists
        Class clazz = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new AppException(ErrorCode.CLASS_NOT_FOUND));

        // Check if teacher exists
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Teacher teacher = teacherRepository.findById(user.getId()).orElseThrow(() -> new AppException(ErrorCode.TEACHER_NOT_FOUND));

        // Check if class teacher already exists
        ClassTeacherId id = new ClassTeacherId(request.getClassId(), teacher.getId());
        if (classTeacherRepository.existsById(id)) {
            throw new AppException(ErrorCode.CLASS_TEACHER_ALREADY_EXISTS);
        }

        ClassTeacher classTeacher = ClassTeacher.builder()
                .id(id)
                ._class(clazz)
                .teacher(teacher)
                .status(ClassTeacherEnrollStatus.PENDING)
                .build();

        ClassTeacher saved = classTeacherRepository.save(classTeacher);
        String message = String.format("You have been invited to teach the class: %s", clazz.getName());
        notificationService.createNotification(user, "Class Invitation", message, NotificationType.CLASS_INVITATION, clazz.getId(), "CLASS");
        log.info("ClassTeacher created: class={}, teacher={}",
                clazz.getName(), teacher.getUser().getFullName());
        return classTeacherMapper.toResponse(saved);
    }

    @Override
    public ClassTeacherResponse update(UUID classId, UUID teacherId, ClassTeacherUpdateRequest request) {
        ClassTeacherId id = new ClassTeacherId(classId, teacherId);
        ClassTeacher classTeacher = classTeacherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CLASS_TEACHER_NOT_FOUND));

        // Update status if provided
        if (request.getStatus() != null) {
            classTeacher.setStatus(request.getStatus());
        }

        ClassTeacher saved = classTeacherRepository.save(classTeacher);
        log.info("ClassTeacher updated: class={}, teacher={}, status={}",
                saved.get_class().getName(), saved.getTeacher().getUser().getFullName(), saved.getStatus());
        return classTeacherMapper.toResponse(saved);
    }

    @Override
    public boolean delete(UUID classId, UUID teacherId) {
        ClassTeacherId id = new ClassTeacherId(classId, teacherId);
        if (!classTeacherRepository.existsById(id)) {
            throw new AppException(ErrorCode.CLASS_TEACHER_NOT_FOUND);
        }
        classTeacherRepository.deleteById(id);
        log.info("ClassTeacher deleted: classId={}, teacherId={}", classId, teacherId);
        return true;
    }
}

