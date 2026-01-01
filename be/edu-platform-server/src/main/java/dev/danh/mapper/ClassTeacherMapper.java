package dev.danh.mapper;

import dev.danh.entities.dtos.response.classteacher.ClassTeacherResponse;
import dev.danh.entities.models.ClassTeacher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface ClassTeacherMapper {
    @Mapping(source = "_class.id", target = "classId")
    @Mapping(source = "_class.name", target = "className")
    @Mapping(source = "_class.classCode", target = "classCode")
    @Mapping(source = "teacher.id", target = "teacherId")
    @Mapping(source = "teacher.user.fullName", target = "teacherName")
    @Mapping(source = "teacher.user.email", target = "teacherEmail")
    ClassTeacherResponse toResponse(ClassTeacher classTeacher);

    ClassTeacherResponse toClassTeacherResponse(ClassTeacher save);
}

