package dev.danh.exception;

import dev.danh.enums.ErrorCode;

public class AppException extends RuntimeException {
    ErrorCode errorCode;

    public AppException(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }


}
