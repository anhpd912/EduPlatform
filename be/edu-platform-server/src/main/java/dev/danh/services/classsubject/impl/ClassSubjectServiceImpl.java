package dev.danh.services.classsubject.impl;

import dev.danh.entities.dtos.request.classsubject.ClassSubjectCreateRequest;
import dev.danh.entities.dtos.request.classsubject.ClassSubjectUpdateRequest;
import dev.danh.entities.dtos.response.classsubject.ClassSubjectResponse;
import dev.danh.entities.embedded.ClassSubjectId;
import dev.danh.entities.models.Class;
import dev.danh.entities.models.ClassSubject;
import dev.danh.entities.models.Subject;
import dev.danh.entities.models.Teacher;
import dev.danh.enums.ClassSubjectStatus;
import dev.danh.enums.ErrorCode;
import dev.danh.exception.AppException;
import dev.danh.mapper.ClassSubjectMapper;
import dev.danh.repositories._class.ClassRepository;
import dev.danh.repositories.subject.ClassSubjectRepository;
import dev.danh.repositories.subject.SubjectRepository;
import dev.danh.repositories.teacher.TeacherRepository;
import dev.danh.services.classsubject.ClassSubjectService;
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
public class ClassSubjectServiceImpl implements ClassSubjectService {
    ClassSubjectRepository classSubjectRepository;
    ClassRepository classRepository;
    SubjectRepository subjectRepository;
    TeacherRepository teacherRepository;
    ClassSubjectMapper classSubjectMapper;

    @Override
    public Page<ClassSubjectResponse> getAll(int page) {
        return classSubjectRepository.findAll(PageRequest.of(Math.max(0, page - 1), 9))
                .map(classSubjectMapper::toResponse);
    }

    @Override
    public ClassSubjectResponse getById(UUID classId, UUID subjectId, UUID teacherId) {
        ClassSubjectId id = new ClassSubjectId(classId, subjectId, teacherId);
        return classSubjectRepository.findById(id)
                .map(classSubjectMapper::toResponse)
                .orElseThrow(() -> new AppException(ErrorCode.CLASS_SUBJECT_NOT_FOUND));
    }

    @Override
    public List<ClassSubjectResponse> getByClassId(UUID classId) {
        return classSubjectRepository.findByIdClassId(classId)
                .stream()
                .map(classSubjectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ClassSubjectResponse> getBySubjectId(UUID subjectId) {
        return classSubjectRepository.findByIdSubjectId(subjectId)
                .stream()
                .map(classSubjectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ClassSubjectResponse> getByTeacherId(UUID teacherId) {
        return classSubjectRepository.findByIdTeacherId(teacherId)
                .stream()
                .map(classSubjectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ClassSubjectResponse create(ClassSubjectCreateRequest request) {
        // Check if class exists
        Class clazz = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new AppException(ErrorCode.CLASS_NOT_FOUND));

        // Check if subject exists
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_FOUND));

        // Check if teacher exists
        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new AppException(ErrorCode.TEACHER_NOT_FOUND));

        // Check if class subject already exists
        ClassSubjectId id = new ClassSubjectId(request.getClassId(), request.getSubjectId(), request.getTeacherId());
        if (classSubjectRepository.existsById(id)) {
            throw new AppException(ErrorCode.CLASS_SUBJECT_ALREADY_EXISTS);
        }

        ClassSubject classSubject = ClassSubject.builder()
                .id(id)
                ._class(clazz)
                .subject(subject)
                .teacher(teacher)
                .status(ClassSubjectStatus.ACTIVE)
                .build();

        ClassSubject saved = classSubjectRepository.save(classSubject);
        log.info("ClassSubject created: class={}, subject={}, teacher={}",
                clazz.getName(), subject.getSubjectName(), teacher.getUser().getFullName());
        return classSubjectMapper.toResponse(saved);
    }

    @Override
    public ClassSubjectResponse update(UUID classId, UUID subjectId, UUID teacherId, ClassSubjectUpdateRequest request) {
        ClassSubjectId id = new ClassSubjectId(classId, subjectId, teacherId);
        ClassSubject classSubject = classSubjectRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CLASS_SUBJECT_NOT_FOUND));

        // Update teacher if provided
        if (request.getNewTeacherId() != null && !request.getNewTeacherId().equals(teacherId)) {
            Teacher newTeacher = teacherRepository.findById(request.getNewTeacherId())
                    .orElseThrow(() -> new AppException(ErrorCode.TEACHER_NOT_FOUND));

            // Delete old record and create new one with new teacher
            classSubjectRepository.delete(classSubject);

            ClassSubjectId newId = new ClassSubjectId(classId, subjectId, request.getNewTeacherId());
            ClassSubject newClassSubject = ClassSubject.builder()
                    .id(newId)
                    ._class(classSubject.get_class())
                    .subject(classSubject.getSubject())
                    .teacher(newTeacher)
                    .status(request.getStatus() != null ? request.getStatus() : classSubject.getStatus())
                    .build();

            ClassSubject saved = classSubjectRepository.save(newClassSubject);
            log.info("ClassSubject updated with new teacher: class={}, subject={}, teacher={}",
                    saved.get_class().getName(), saved.getSubject().getSubjectName(), newTeacher.getUser().getFullName());
            return classSubjectMapper.toResponse(saved);
        }

        // Update status if provided
        if (request.getStatus() != null) {
            classSubject.setStatus(request.getStatus());
        }

        ClassSubject saved = classSubjectRepository.save(classSubject);
        log.info("ClassSubject updated: class={}, subject={}, teacher={}",
                saved.get_class().getName(), saved.getSubject().getSubjectName(), saved.getTeacher().getUser().getFullName());
        return classSubjectMapper.toResponse(saved);
    }

    @Override
    public boolean delete(UUID classId, UUID subjectId, UUID teacherId) {
        ClassSubjectId id = new ClassSubjectId(classId, subjectId, teacherId);
        if (!classSubjectRepository.existsById(id)) {
            throw new AppException(ErrorCode.CLASS_SUBJECT_NOT_FOUND);
        }
        classSubjectRepository.deleteById(id);
        log.info("ClassSubject deleted: classId={}, subjectId={}, teacherId={}", classId, subjectId, teacherId);
        return true;
    }
}

