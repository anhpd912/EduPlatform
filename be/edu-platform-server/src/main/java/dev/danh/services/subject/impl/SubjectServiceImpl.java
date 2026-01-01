package dev.danh.services.subject.impl;

import dev.danh.entities.dtos.request.subject.SubjectCreateRequest;
import dev.danh.entities.dtos.request.subject.SubjectUpdateRequest;
import dev.danh.entities.dtos.response.subject.SubjectResponse;
import dev.danh.entities.models.Subject;
import dev.danh.enums.ErrorCode;
import dev.danh.exception.AppException;
import dev.danh.mapper.SubjectMapper;
import dev.danh.repositories.subject.SubjectRepository;
import dev.danh.services.subject.SubjectService;
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
public class SubjectServiceImpl implements SubjectService {
    SubjectRepository subjectRepository;
    SubjectMapper subjectMapper;

    @Override
    public Page<SubjectResponse> getAll(int page) {
        return subjectRepository.findAll(PageRequest.of(Math.max(0, page - 1), 9))
                .map(subjectMapper::toResponse);
    }

    @Override
    public SubjectResponse getById(UUID id) {
        return subjectRepository.findById(id)
                .map(subjectMapper::toResponse)
                .orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_FOUND));
    }

    @Override
    public SubjectResponse getBySubjectCode(String subjectCode) {
        return subjectRepository.findBySubjectCode(subjectCode)
                .map(subjectMapper::toResponse)
                .orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_FOUND));
    }

    @Override
    public SubjectResponse create(SubjectCreateRequest request) {
        if (subjectRepository.existsBySubjectCode(request.getSubjectCode())) {
            throw new AppException(ErrorCode.SUBJECT_CODE_ALREADY_EXISTS);
        }

        Subject subject = Subject.builder()
                .subjectCode(request.getSubjectCode())
                .subjectName(request.getSubjectName())
                .description(request.getDescription())
                .build();

        Subject saved = subjectRepository.save(subject);
        log.info("Subject created: {} - {}", saved.getSubjectCode(), saved.getSubjectName());
        return subjectMapper.toResponse(saved);
    }

    @Override
    public SubjectResponse update(UUID id, SubjectUpdateRequest request) {
        Optional<Subject> optionalSubject = subjectRepository.findById(id);
        if (optionalSubject.isEmpty()) {
            throw new AppException(ErrorCode.SUBJECT_NOT_FOUND);
        }

        Subject subject = optionalSubject.get();

        // Check if subject code is being changed and if new code already exists
        if (request.getSubjectCode() != null && !request.getSubjectCode().equals(subject.getSubjectCode())) {
            if (subjectRepository.existsBySubjectCode(request.getSubjectCode())) {
                throw new AppException(ErrorCode.SUBJECT_CODE_ALREADY_EXISTS);
            }
            subject.setSubjectCode(request.getSubjectCode());
        }

        if (request.getSubjectName() != null) {
            subject.setSubjectName(request.getSubjectName());
        }

        if (request.getDescription() != null) {
            subject.setDescription(request.getDescription());
        }

        Subject saved = subjectRepository.save(subject);
        log.info("Subject updated: {} - {}", saved.getSubjectCode(), saved.getSubjectName());
        return subjectMapper.toResponse(saved);
    }

    @Override
    public boolean delete(UUID id) {
        Optional<Subject> optionalSubject = subjectRepository.findById(id);
        if (optionalSubject.isEmpty()) {
            throw new AppException(ErrorCode.SUBJECT_NOT_FOUND);
        }
        subjectRepository.deleteById(id);
        log.info("Subject deleted: {}", id);
        return true;
    }
}

