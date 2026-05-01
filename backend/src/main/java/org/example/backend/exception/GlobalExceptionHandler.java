package org.example.backend.exception;

import org.example.backend.dto.response.ApiResponse;
import org.example.backend.enums.ErrorCode;
import org.example.backend.util.ApiResponseUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<Void>> handleAppException(AppException exception) {
        ErrorCode error = exception.getErrorCode();
        return ApiResponseUtil.error(error);
    }

    @ExceptionHandler(value = MaxUploadSizeExceededException.class)
    ResponseEntity<ApiResponse<Void>> handleMaxUploadSize(MaxUploadSizeExceededException exception) {
        // Return a standardized API error response when upload size exceeds limit
        return ApiResponseUtil.error(ErrorCode.FILE_SIZE_EXCEEDED);
    }
}
