package dev.danh.services.user.impl;

import dev.danh.entities.dtos.request.UserCreateRequest;
import dev.danh.entities.dtos.request.UserUpdateRequest;
import dev.danh.entities.dtos.response.UserResponse;
import dev.danh.entities.models.Role;
import dev.danh.entities.models.Student;
import dev.danh.entities.models.Teacher;
import dev.danh.entities.models.User;
import dev.danh.enums.AuthProvider;
import dev.danh.enums.ErrorCode;
import dev.danh.exception.AppException;
import dev.danh.mapper.UserMapper;
import dev.danh.repositories.auth.RoleRepository;
import dev.danh.repositories.user.UserRepository;
import dev.danh.services.user.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    @Override
    public UserResponse createUser(UserCreateRequest userCreateRequest) {
        boolean checkExistByEmail = userRepository.existsByEmail(userCreateRequest.getEmail());
        if(checkExistByEmail){
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        boolean checkExistByUsername = userRepository.existsByUsername(userCreateRequest.getUsername());
        if(checkExistByUsername){
            throw new AppException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }
        User user = new User();
        user = userMapper.toUser(userCreateRequest, user);
        String roleName = userCreateRequest.getRole().toUpperCase();
        Role role = roleRepository.findById(roleName)
                .orElseThrow(() -> new AppException(ErrorCode.UNKNOWN_ERROR));
        user.setRoles(Set.of(role));
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Xử lý tạo Student nếu là STUDENT
        if ("STUDENT".equals(roleName)) {
            Student student = new Student();
            student.setUser(user); // liên kết user
            user.setStudent(student);
        }

        // Hoặc nếu là TEACHER
        if ("TEACHER".equals(roleName)) {
            Teacher teacher = new Teacher();
            teacher.setUser(user);
            user.setTeacher(teacher);
        }
        user.setAuthProvider(AuthProvider.LOCAL);
        log.info("user create: "+user.getFullName());
        try {
            userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.USERNAME_OR_EMAIL_ALREADY_EXISTS);
        }
        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse updateUser(UUID id, UserUpdateRequest userUpdateRequest) {
        User us = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        us = userMapper.toUser(userUpdateRequest, us);
        us.setPassword(passwordEncoder.encode(us.getPassword()));
        userRepository.save(us);
        return userMapper.toUserResponse(us);
    }

    @Override
    public UserResponse deleteUser(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setIsActive(false);
        userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse getUserById(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse getUserByUsername(String username) {
        return null;
    }

    @Override
    public UserResponse getUserByEmail(String email) {
        return null;
    }

    @Override
    public UserResponse activateUser(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setIsActive(true);
        userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse getMyProfile() {
        // Assuming you have a method to get the current user's ID
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }


}
