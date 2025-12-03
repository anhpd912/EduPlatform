package dev.danh.controllers.user;

import dev.danh.controllers.websocket.UpdateController;
import dev.danh.entities.dtos.request.CompleteRegisterRequest;
import dev.danh.entities.dtos.request.UserCreateRequest;
import dev.danh.entities.dtos.request.UserUpdateRequest;
import dev.danh.entities.dtos.response.APIResponse;
import dev.danh.services.user.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class UserController {
    UserService userService;
    private final UpdateController updateController;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getAll")
    public ResponseEntity<APIResponse> getAllUsers() {
        return ResponseEntity.ok(
                APIResponse.builder()
                        .message("Users retrieved successfully")
                        .data(userService.getAllUsers())
                        .build()
        );
    }


    @PostMapping("/create")
    public ResponseEntity<APIResponse> createUser(@RequestBody UserCreateRequest userCreateRequest) {
        var user = userService.createUser(userCreateRequest);
        // Send the user creation event to the WebSocket topic
        updateController.sendUpdate(user);
        return ResponseEntity.ok(
                APIResponse.builder()
                        .message("User created successfully")
                        .data(user)
                        .statusCode(200)
                        .build()
        );
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<APIResponse> updateUser(@PathVariable UUID id, @RequestBody UserUpdateRequest userUpdateRequest) {
        return ResponseEntity.ok(
                APIResponse.builder()
                        .message("User updated successfully")
                        .data(userService.updateUser(id, userUpdateRequest))
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
        // Send the user deletion event to the WebSocket topic
        updateController.sendUpdate(deletedUser);
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
        updateController.sendUpdate(activatedUser);
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
