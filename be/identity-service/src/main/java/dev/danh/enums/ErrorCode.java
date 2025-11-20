package dev.danh.enums;

import lombok.Getter;
import org.springframework.http.HttpStatus;
@Getter
public enum ErrorCode {

    USER_NOT_FOUND( "User not found", HttpStatus.NOT_FOUND),
    USERNAME_OR_EMAIL_ALREADY_EXISTS( "Username or email already exists", HttpStatus.CONFLICT),
    USERNAME_ALREADY_EXISTS( "Username already exists", HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_EXISTS( "Email already exists", HttpStatus.BAD_REQUEST),
    INVALID_CREDENTIALS("Invalid credentials",  HttpStatus.UNAUTHORIZED),
    INVALID_PASSWORD( "Invalid password", HttpStatus.BAD_REQUEST),
    LENGTH_PASSWORD( "Password must be at least 8 characters", HttpStatus.BAD_REQUEST),
    INVALID_USERNAME( "Invalid username", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL( "Invalid email", HttpStatus.BAD_REQUEST),
    PERMISSION_NOT_FOUND( "Permission not found", HttpStatus.NOT_FOUND),
    UNKNOWN_ERROR( "Unknown error", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHORIZED( "Unauthorized", HttpStatus.UNAUTHORIZED),
    UNAUTHENTICATED( "You do not have access to this api", HttpStatus.FORBIDDEN),
    FORBIDDEN( "Forbidden", HttpStatus.FORBIDDEN),
    INVALID_TOKEN( "Invalid token", HttpStatus.UNAUTHORIZED);
    private String message;
    private HttpStatus httpStatus;

    private ErrorCode( String message, HttpStatus httpStatus) {
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
