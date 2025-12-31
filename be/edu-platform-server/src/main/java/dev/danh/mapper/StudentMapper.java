package dev.danh.mapper;

import dev.danh.entities.dtos.response.student.StudentAdminResponse;
import dev.danh.entities.models.Student;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface StudentMapper {
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "user.email", target = "email")
    @Mapping(source = "user.fullName", target = "fullName")
    @Mapping(source = "user.avatarUrl", target = "avatarUrl")
    @Mapping(source = "user.gender", target = "gender")
    @Mapping(source = "user.phoneNumber", target = "phoneNumber")
    @Mapping(source = "user.address", target = "address")
    @Mapping(source = "user.dateOfBirth", target = "dateOfBirth")
    @Mapping(source = "user.isActive", target = "isActive")
    @Mapping(source = "user.createdDate", target = "createdDate")
    @Mapping(source = "user.updatedDate", target = "updatedDate")
    @Mapping(source = "user.roles", target = "roles")
    StudentAdminResponse toStudentAdminResponse(Student student);
}
