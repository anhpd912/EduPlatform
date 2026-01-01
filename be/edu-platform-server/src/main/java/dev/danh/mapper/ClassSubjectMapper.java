package dev.danh.mapper;

import dev.danh.entities.dtos.response.classsubject.ClassSubjectResponse;
import dev.danh.entities.models.ClassSubject;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface ClassSubjectMapper {
    @Mapping(source = "_class.id", target = "classId")
    @Mapping(source = "_class.name", target = "className")
    @Mapping(source = "subject.subjectId", target = "subjectId")
    @Mapping(source = "subject.subjectName", target = "subjectName")
    @Mapping(source = "subject.subjectCode", target = "subjectCode")
    @Mapping(source = "teacher.id", target = "teacherId")
    @Mapping(source = "teacher.user.fullName", target = "teacherName")
    ClassSubjectResponse toResponse(ClassSubject classSubject);
}

