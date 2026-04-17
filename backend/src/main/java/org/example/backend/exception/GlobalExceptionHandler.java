package org.example.backend.exception;

import lombok.Builder;
import org.example.backend.dto.response.ApiResponse;

import org.example.backend.enums.ErrorCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@Builder
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<Void>> handleAppException(AppException exception) {
        ErrorCode error = exception.getErrorCode();
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .code(error.getCode())
                .message(error.getMessage())
                .status(error.getStatus())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(error.getStatus()).body(apiResponse);
    }
}
