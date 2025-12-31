package dev.danh.mapper;

import dev.danh.entities.dtos.request.user.UserCreateRequest;
import dev.danh.entities.dtos.request.user.UserUpdateRequest;
import dev.danh.entities.dtos.response.UserResponse;
import dev.danh.entities.models.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toUserResponse(User userResponse);
    @Mapping(target = "roles", ignore = true)
    User toUser(UserCreateRequest request, @MappingTarget User user);
    @Mapping(target = "roles", ignore = true)
    User toUser(UserUpdateRequest request, @MappingTarget User user);
}
