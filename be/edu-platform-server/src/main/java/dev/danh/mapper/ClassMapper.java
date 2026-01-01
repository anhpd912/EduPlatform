package dev.danh.mapper;

import dev.danh.entities.dtos.response.classs.ClassResponse;
import dev.danh.entities.dtos.response.classs.ClassTeacherResponse;
import dev.danh.entities.models.Class;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface ClassMapper {
    @Mapping(source = "homeroomTeacher.id", target = "homeroomTeacherId")
    @Mapping(source = "homeroomTeacher.user.fullName", target = "homeroomTeacherName")
    ClassResponse toResponse(Class _class);

    @Mapping(source = "homeroomTeacher.id", target = "homeroomTeacherId")
    @Mapping(source = "homeroomTeacher.user.fullName", target = "homeroomTeacherName")
    ClassTeacherResponse toTeacherResponse(Class aClass);
}
