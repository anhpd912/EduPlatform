package dev.danh.controllers.auth;

import dev.danh.entities.dtos.request.auth.*;
import dev.danh.entities.dtos.response.APIResponse;
import dev.danh.services.auth.AuthService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.ParseException;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {

    @NonFinal
    @Value("${enable.secure}")
    Boolean ENABLE_SECURE;

    AuthService authService;

    @PostMapping("/login")
    /**
     * Authenticates a user with the provided credentials.
     * @param request The authentication request containing username and password.
     * @return A ResponseEntity containing an APIResponse with authentication details and a refresh token cookie.
     */
    public ResponseEntity<APIResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var response = authService.authenticate(request);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", response.getRefreshToken())
                .httpOnly(true)
                .secure(ENABLE_SECURE)
                .path("/")
                .sameSite("Lax")
                //If not remember , cookie is active in session
                .maxAge(request.getRememberMe() ? response.getRefreshTokenDuration() : -1)
                .build();
        return ResponseEntity.ok()
                //Set cookie for saving refresh token
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(APIResponse.builder().message("Authenticate successfully").data(response).statusCode(200)
                        .build());
    }

    @PostMapping("/introspect")
    /**
     * Introspects an access token to validate its authenticity and retrieve its claims.
     * @param request The introspect request containing the access token.
     * @return A ResponseEntity containing an APIResponse with the introspection result.
     */
    public ResponseEntity<APIResponse> introspect(@RequestBody IntrospectRequest request) {
        var response = authService.introspect(request);
        return ResponseEntity.ok(APIResponse.builder()
                .message("Introspect successfully")
                .data(response)
                .statusCode(200)
                .build());
    }

    @PostMapping("/logout")
    /**
     * Logs out a user by invalidating their access and refresh tokens.
     * @param authHeader The Authorization header containing the access token.
     * @param refreshToken The refresh token provided as a cookie.
     * @return A ResponseEntity containing an APIResponse indicating successful logout.
     */
    public ResponseEntity<APIResponse> logout(@RequestHeader("Authorization") String authHeader, @CookieValue("refreshToken") String refreshToken) {
        authService.logout(LogoutRequest.builder().accessToken(authHeader.substring(7)).refreshToken(refreshToken).build());
        ResponseCookie cleanCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(ENABLE_SECURE)
                .path("/")
                .maxAge(0) // <--- Set về 0 để trình duyệt xóa ngay lập tức
                .sameSite("Lax")
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cleanCookie.toString())
                .body(APIResponse.builder()
                        .statusCode(200)
                        .message("Logout successfully")
                        .build()
                );
    }

    @PostMapping("/register")
    /**
     * Registers a new user with the provided credentials.
     * @param request The authentication request containing registration details.
     * @return A ResponseEntity containing an APIResponse with registration details.
     */
    public ResponseEntity<APIResponse> register(@RequestBody AuthenticationRequest request) {
        var response = authService.authenticate(request);
        return ResponseEntity.ok(APIResponse.builder().message("Register successfully.").data(response).statusCode(200).build());
    }

    @PostMapping("/refresh")
    public ResponseEntity<APIResponse> refreshToken(@CookieValue("refreshToken") String token) throws ParseException {
        /**
         * Refreshes an access token using a provided refresh token.
         * @param token The refresh token provided as a cookie.
         * @return A ResponseEntity containing an APIResponse with the new access token.
         * @throws ParseException If there is an error parsing the token.
         */
        log.info("Refresh token {}", token);
        var response = authService.refreshToken(token);
        log.info("New access token {}", response.getAccessToken());
        ResponseCookie cookie = ResponseCookie.from("refreshToken", response.getRefreshToken())
                .httpOnly(true)
                .secure(ENABLE_SECURE)
                .path("/")
                .maxAge(response.getRefreshTokenDuration())
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(APIResponse.builder().message("Refresh token successfully").data(response).statusCode(200).build());
    }

    @GetMapping("/login/google")
    /**
     * Redirects the user to the Google OAuth2 authorization endpoint.
     * @param response The HttpServletResponse to send the redirect.
     * @param request The HttpServletRequest.
     * @throws IOException If an I/O error occurs during redirection.
     */
    public void googleCallback(HttpServletResponse response, HttpServletRequest request) throws IOException {
        response.sendRedirect("/oauth2/authorization/google");
    }

    @GetMapping("/failure")
    /**
     * Handles authentication failures, returning an error message.
     * @param error The error message from the authentication failure.
     * @return A ResponseEntity containing an APIResponse with the error message.
     */
    public ResponseEntity<APIResponse> failure(@RequestParam String error) {
        return ResponseEntity.badRequest().body(APIResponse.builder().message("Authentication failed: " + error).statusCode(400).build());
    }

    @GetMapping("/reset-password")
    /**
     * Initiates the password reset process for a given email.
     * @param email The email address of the user requesting a password reset.
     * @return A ResponseEntity containing an APIResponse indicating the success or failure of the reset request.
     * @throws MessagingException If an error occurs during email sending.
     */
    public ResponseEntity<APIResponse> resetPassword(@RequestParam String email) throws MessagingException {
        return ResponseEntity.ok(APIResponse.builder().message(authService.resetPassword(email) ? "Reset password successfully" : "Reset password failed").statusCode(200).build());
    }

    @PostMapping("/reset-password")
    /**
     * Updates the user's password using a reset token.
     * @param request The ResetPasswordRequest containing the reset token and new password.
     * @return A ResponseEntity containing an APIResponse indicating the success or failure of the password update.
     */
    public ResponseEntity<APIResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        Boolean result = authService.updatePassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(APIResponse.builder()
                .message(result ? "Update password successfully" : "Update password failed")
                .statusCode(result ? 200 : 400)
                .build());
    }

    @PostMapping("/logout-device")
    public ResponseEntity<APIResponse> logoutDevice(@RequestHeader("Authorization") String authHeader, @RequestBody LogOutDeviceRequest request) {
        Boolean result = authService.logOutDevice(request);
        return ResponseEntity.ok(APIResponse.builder()
                .message(result ? "Device logout successfully" : "Device logout failed")
                .statusCode(result ? 200 : 400)
                .build());
    }
    @GetMapping("/devices")
    public ResponseEntity<APIResponse> getUserDevices(@RequestHeader("Authorization") String authHeader) throws ParseException {
        var devices = authService.getUserDevices(authHeader.substring(7));
        return ResponseEntity.ok(APIResponse.builder()
                .message("User devices retrieved successfully")
                .data(devices)
                .statusCode(200)
                .build());
    }

}
