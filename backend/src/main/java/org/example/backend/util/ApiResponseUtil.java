package org.example.backend.util;

import org.example.backend.enums.ErrorCode;
import org.example.backend.enums.SuccessCode;
import org.example.backend.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

public class ApiResponseUtil {
    public static <T> ResponseEntity<ApiResponse<T>> success(T data, SuccessCode successCode) {
       ApiResponse<T> response = ApiResponse.<T>builder()
                .code(successCode.getCode())
                .message(successCode.getMessage())
                .timestamp(LocalDateTime.now())
                .data(data)
                .status(successCode.getStatus())
                .build();
       return ResponseEntity.status(successCode.getStatus()).body(response);
    }

    public static <T> ResponseEntity<ApiResponse<T>> error(T data, ErrorCode errorCode) {
        ApiResponse<T> response = ApiResponse.<T>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .timestamp(LocalDateTime.now())
                .data(data)
                .status(errorCode.getStatus())
                .build();
        return ResponseEntity.status(errorCode.getStatus()).body(response);
    }

    public static ResponseEntity<ApiResponse<Void>> success(SuccessCode successCode) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(successCode.getCode())
                .message(successCode.getMessage())
                .status(successCode.getStatus())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(successCode.getStatus()).body(response);
    }

    public static ResponseEntity<ApiResponse<Void>> error(ErrorCode errorCode) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .status(errorCode.getStatus())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(errorCode.getStatus()).body(response);
    }
}
