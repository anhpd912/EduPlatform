package dev.danh.controllers.user;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import dev.danh.entities.dtos.request.auth.CompleteRegisterRequest;
import dev.danh.entities.dtos.request.user.UserCreateRequest;
import dev.danh.entities.dtos.request.user.UserUpdateRequest;
import dev.danh.entities.dtos.response.APIResponse;
import dev.danh.services.user.UserService;
import jakarta.servlet.annotation.MultipartConfig;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@MultipartConfig(maxFileSize = 5 * 1024 * 1024) // 5 MB
public class UserController {
    UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getAll")
    public ResponseEntity<APIResponse> getAllUsers(@RequestParam int page) {
        return ResponseEntity.ok(
                APIResponse.builder()
                        .message("Users retrieved successfully")
                        .data(userService.getAllUsers(page))
                        .build()
        );
    }

    @PostMapping("/create")
    public ResponseEntity<APIResponse> createUser(@RequestParam("user-data") String userData,
                                                  @RequestParam("image") MultipartFile image) throws JsonProcessingException {
        // Convert JSON string to UserCreateRequest
        ObjectMapper objectMapper = new ObjectMapper();
        // Register JavaTimeModule so java.time.* types (e.g., LocalDate) are handled correctly
        objectMapper.registerModule(new JavaTimeModule());
        // Prefer ISO dates (not timestamps)
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        UserCreateRequest userCreateRequest = objectMapper.readValue(userData, UserCreateRequest.class);
        var user = userService.createUser(userCreateRequest, image);
        return ResponseEntity.ok(
                APIResponse.builder()
                        .message("User created successfully")
                        .data(user)
                        .statusCode(200)
                        .build()
        );
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<APIResponse> updateUser(@PathVariable UUID id,
                                                  @RequestParam("user-data") String userData,
                                                  @RequestParam("image") MultipartFile image) throws JsonProcessingException {
        // Convert JSON string to UserUpdateRequest
        ObjectMapper objectMapper = new ObjectMapper();
        // Register JavaTimeModule so java.time.* types (e.g., LocalDate) are handled correctly
        objectMapper.registerModule(new JavaTimeModule());
        // Prefer ISO dates (not timestamps)
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        UserUpdateRequest userUpdateRequest = objectMapper.readValue(userData, UserUpdateRequest.class);
        return ResponseEntity.ok(
                APIResponse.builder()
                        .message("User updated successfully")
                        .data(userService.updateUser(id, userUpdateRequest, image))
                        .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/get/{id}")
    public ResponseEntity<APIResponse> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(
                APIResponse.builder()
                        .message("User retrieved successfully")
                        .data(userService.getUserById(id))
                        .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<APIResponse> deleteUser(@PathVariable UUID id) {
        var deletedUser = userService.deleteUser(id);
        return ResponseEntity.ok(
                APIResponse.builder()
                        .message("User deleted successfully")
                        .data(deletedUser)
                        .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/activate/{id}")
    public ResponseEntity<APIResponse> activateUser(@PathVariable UUID id) {
        var activatedUser = userService.activateUser(id);
        return ResponseEntity.ok(
                APIResponse.builder()
                        .message("User activated successfully")
                        .data(activatedUser)
                        .build()
        );
    }

    @GetMapping("/myProfile")
    public ResponseEntity<APIResponse> getMyProfile() {
        return ResponseEntity.ok(
                APIResponse.builder()
                        .message("User retrieved successfully")
                        .data(userService.getMyProfile())
                        .statusCode(200)
                        .build()
        );
    }

    @PostMapping("/complete-register")
    public ResponseEntity<APIResponse> completeRegister(@RequestBody CompleteRegisterRequest userUpdateRequest) {
        boolean result = userService.completeRegister(userUpdateRequest);
        return ResponseEntity.ok(
                APIResponse.builder()
                        .message("User completed register successfully")
                        .data(result ? "Registration Completed" : "Registration Failed")
                        .statusCode(result ? 200 : 400)
                        .build()
        );
    }

}
