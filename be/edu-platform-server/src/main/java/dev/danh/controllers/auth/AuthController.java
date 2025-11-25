package dev.danh.controllers.auth;

import dev.danh.entities.dtos.request.AuthenticationRequest;
import dev.danh.entities.dtos.request.IntrospectRequest;
import dev.danh.entities.dtos.request.LogoutRequest;
import dev.danh.entities.dtos.request.ResetPasswordRequest;
import dev.danh.entities.dtos.response.APIResponse;
import dev.danh.services.auth.AuthService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {

    AuthService authService;

    @PostMapping("/token")
    public ResponseEntity<APIResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var response = authService.authenticate(request);
        return ResponseEntity.ok(APIResponse.builder().message("Authenticate successfully").data(response).statusCode(200).build());
    }

    @PostMapping("/introspect")
    public ResponseEntity<APIResponse> introspect(@RequestBody IntrospectRequest request) {
        var response = authService.introspect(request);
        return ResponseEntity.ok(APIResponse.builder().message("Introspect successfully").data(response).statusCode(200).build());
    }

    @PostMapping("/logout")
    public ResponseEntity<APIResponse> logout(@RequestBody LogoutRequest request) {
        authService.logout(request);
        return ResponseEntity.ok(APIResponse.builder().message("Log out successfully").statusCode(200).build());
    }

    @PostMapping("/register")
    public ResponseEntity<APIResponse> register(@RequestBody AuthenticationRequest request) {
        var response = authService.authenticate(request);
        return ResponseEntity.ok(APIResponse.builder().message("Register successfully.").data(response).statusCode(200).build());
    }

    @PostMapping("/refresh")
    public ResponseEntity<APIResponse> refreshToken(@RequestBody dev.danh.entities.dtos.request.RefreshRequest request) throws ParseException {
        var response = authService.refreshToken(request);
        return ResponseEntity.ok(APIResponse.builder().message("Refresh token successfully").data(response).statusCode(200).build());
    }

    @GetMapping("/login/google")
    public void googleCallback(HttpServletResponse response, HttpServletRequest request) throws IOException {
        response.sendRedirect("/oauth2/authorization/google");
    }

    @GetMapping("/failure")
    public ResponseEntity<APIResponse> failure(@RequestParam String error) {
        return ResponseEntity.badRequest().body(APIResponse.builder().message("Authentication failed: " + error).statusCode(400).build());
    }

    @GetMapping("/reset-password")
    public ResponseEntity<APIResponse> resetPassword(@RequestParam String email) throws MessagingException {
        return ResponseEntity.ok(APIResponse.builder().message(authService.resetPassword(email) ? "Reset password successfully" : "Reset password failed").statusCode(200).build());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<APIResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        Boolean result = authService.updatePassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(APIResponse.builder()
                .message(result ? "Update password successfully" : "Update password failed")
                .statusCode(result ? 200 : 400)
                .build());
    }

}
