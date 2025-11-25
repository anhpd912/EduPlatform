package dev.danh.exception;

import dev.danh.entities.dtos.response.APIResponse;
import dev.danh.enums.ErrorCode;
import jakarta.mail.MessagingException;
import jakarta.validation.ConstraintViolation;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.text.ParseException;
import java.util.Map;
import java.util.Objects;

@ControllerAdvice
public class GlobalExceptionHandler {
    private final String MIN_ATTRIBUTE = "min";

    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponse> handleException(Exception e) {
        return ResponseEntity.status(500).body(APIResponse.builder().message(e.getMessage()).statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value()).build());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<APIResponse> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.status(500).body(APIResponse.builder().message(e.getMessage()).statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value()).build());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        Map<String, Object> attr = null;
        String message = e.getBindingResult().getFieldError().getDefaultMessage();
        ErrorCode errorCode = ErrorCode.UNKNOWN_ERROR;
        try {
            errorCode = ErrorCode.valueOf(message);
            // get constraint violation from exception
            var constraintViolation = e.getBindingResult().getAllErrors().get(0).unwrap(ConstraintViolation.class);
            // get min value of constraint
            attr = constraintViolation.getConstraintDescriptor().getAttributes();
            return ResponseEntity.badRequest().body(APIResponse.builder().message(Objects.nonNull(attr) ? mapAttribute(errorCode.getMessage(), attr) : errorCode.getMessage()).statusCode(errorCode.getHttpStatus().value()).build());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(APIResponse.builder().message(message).statusCode(errorCode.getHttpStatus().value()).build());
        }
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<APIResponse> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity.status(400).body(APIResponse.builder().message(e.getMessage()).statusCode(HttpStatus.BAD_REQUEST.value()).build());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<APIResponse> handleDataIntegrityViolationException(DataIntegrityViolationException e) {
        ErrorCode errorCode = null;
        if (e.getMessage().contains("email")) {
            errorCode = ErrorCode.EMAIL_ALREADY_EXISTS;
        } else if (e.getMessage().contains("username")) {
            errorCode = ErrorCode.USERNAME_ALREADY_EXISTS;
        } else {
            errorCode = ErrorCode.UNKNOWN_ERROR;
        }
        return ResponseEntity.badRequest().body(APIResponse.builder().message(errorCode.getMessage()).statusCode(errorCode.getHttpStatus().value()).build());
    }

    @ExceptionHandler(AppException.class)
    public ResponseEntity<APIResponse> handleAppException(AppException e) {
        return ResponseEntity.status(e.errorCode.getHttpStatus()).body(APIResponse.builder().message(e.errorCode.getMessage()).statusCode(e.errorCode.getHttpStatus().value()).build());
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<APIResponse> handleAuthorizationDeniedException(AuthorizationDeniedException e) {
        ErrorCode errorCode = ErrorCode.FORBIDDEN;
        return ResponseEntity.status(errorCode.getHttpStatus()).body(APIResponse.builder().message(errorCode.getMessage()).statusCode(errorCode.getHttpStatus().value()).build());
    }

    private String mapAttribute(String message, Map<String, Object> attributes) {
        String min = attributes.get(MIN_ATTRIBUTE).toString();
        message = message.replace("{" + MIN_ATTRIBUTE + "}", min);
        return message;
    }

    @ExceptionHandler(MessagingException.class)
    public ResponseEntity<APIResponse> handleMessagingException(MessagingException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(APIResponse.builder()
                .statusCode(500)
                .message(ErrorCode.SEND_MAIL_FAILED.getMessage())
                .build()
        );
    }

    @ExceptionHandler(ParseException.class)
    public ResponseEntity<APIResponse> handleParseException(ParseException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(APIResponse.builder()
                .statusCode(500)
                .message(e.getMessage())
                .build()
        );
    }
}
