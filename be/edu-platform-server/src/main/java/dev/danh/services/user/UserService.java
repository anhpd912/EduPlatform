package dev.danh.services.user;

import dev.danh.entities.dtos.request.auth.CompleteRegisterRequest;
import dev.danh.entities.dtos.request.user.UserCreateRequest;
import dev.danh.entities.dtos.request.user.UserUpdateRequest;
import dev.danh.entities.dtos.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface UserService {
    Page<UserResponse> getAllUsers(int page);
    UserResponse createUser(UserCreateRequest userCreateRequest, MultipartFile image);
    UserResponse updateUser(UUID id,UserUpdateRequest userUpdateRequest, MultipartFile image);
    UserResponse deleteUser(UUID userId);
    UserResponse getUserById(UUID userId);
    UserResponse getUserByUsername(String username);
    UserResponse getUserByEmail(String email);
    UserResponse activateUser(UUID userId);
    UserResponse getMyProfile();

    Boolean completeRegister(CompleteRegisterRequest userUpdateRequest);
}
