package dev.danh.mapper;

import dev.danh.entities.dtos.response.subject.SubjectResponse;
import dev.danh.entities.models.Subject;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface SubjectMapper {
    SubjectResponse toResponse(Subject subject);
}

