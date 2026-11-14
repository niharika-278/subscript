package com.subscript.dto;

import java.time.LocalDateTime;
import java.util.Map;

/** Consistent JSON error shape returned by GlobalExceptionHandler. */
public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        Map<String, String> details
) {
    public static ErrorResponse of(int status, String error, String message) {
        return new ErrorResponse(LocalDateTime.now(), status, error, message, null);
    }

    public static ErrorResponse of(int status, String error, String message, Map<String, String> details) {
        return new ErrorResponse(LocalDateTime.now(), status, error, message, details);
    }
}
