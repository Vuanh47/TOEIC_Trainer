package org.example.backend.enums;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {

    // Authentication errors (1001–1020)
    LOGIN_FAIL(1001, "Login failed", HttpStatus.BAD_REQUEST),
    USERNAME_EXISTED(1002, "Username already exists", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1007, "Email already exists", HttpStatus.BAD_REQUEST),
    INVALID_ACCOUNT_DATA(1008, "Invalid account data", HttpStatus.BAD_REQUEST),
    DOCTOR_NOT_EXISTED(1003, "Doctor does not exist", HttpStatus.BAD_REQUEST),
    USERNAME_NOT_EXISTED(1004, "Username does not exist", HttpStatus.BAD_REQUEST),
    PATIENT_NOT_EXISTED(1005, "Patient does not exist", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1006, "Invalid password", HttpStatus.UNAUTHORIZED),
    PATIENT_EXISTED(1005, "Patient does exist", HttpStatus.BAD_REQUEST),

    PATIENT_HAS_NO_MANAGING_DOCTOR(1010, "This patient has no managing doctor", HttpStatus.BAD_REQUEST),
    NO_DOCTORS_IN_DEPARTMENT(1011, "No doctors found in this department", HttpStatus.BAD_REQUEST),

    // Message errors (3001–3020)
    USER_NOT_FOUND(3001, "User not found", HttpStatus.BAD_REQUEST),
    MESSAGE_NOT_FOUND(3002, "Message not found", HttpStatus.BAD_REQUEST),
    MESSAGE_SEND_FAILED(3003, "Failed to send message", HttpStatus.BAD_REQUEST),
    INVALID_MESSAGE_TYPE(3004, "Invalid message type", HttpStatus.BAD_REQUEST),
    ROOM_NOT_FOUND(3005, "Chat room not found", HttpStatus.BAD_REQUEST),

    // Classification errors (3021–3040)
    CLASSIFICATION_NOT_FOUND(3021, "Classification not found", HttpStatus.BAD_REQUEST),
    CLASSIFICATION_FAILED(3022, "AI classification failed", HttpStatus.BAD_REQUEST),
    ALREADY_VERIFIED(3023, "Classification already verified", HttpStatus.BAD_REQUEST),
    INVALID_URGENCY_LEVEL(3024, "Invalid urgency level", HttpStatus.BAD_REQUEST),

    //ARTICLE
    ARTICLE_NOT_EXISTED(6001, "Article not found", HttpStatus.NOT_FOUND),
    // ⭐ NEW ERROR
    INVALID_SEVERITY_LEVEL(3025, "Invalid severity level", HttpStatus.BAD_REQUEST),
    NO_UNREAD_MESSAGES(4004, "Không có tin nhắn chưa đọc từ bệnh nhân này",  HttpStatus.BAD_REQUEST),
    // Permission errors (3041–3060)
    NOT_DOCTOR_ROLE(3041, "Only doctors can verify classifications", HttpStatus.BAD_REQUEST),
    NOT_MESSAGE_SENDER(3042, "You are not the sender of this message", HttpStatus.BAD_REQUEST),
    NOT_MESSAGE_RECEIVER(3043, "You are not the receiver of this message", HttpStatus.BAD_REQUEST),

    // Medical encounter errors
    MEDICAL_ENCOUNTER_NOT_EXISTED(4001, "Medical encounter not found", HttpStatus.NOT_FOUND),
    MEDICAL_ENCOUNTER_EXISTED(4001, "Medical encounter found", HttpStatus.NOT_FOUND),

    // AI API errors
    AI_API_ERROR(5001, "AI API request error", HttpStatus.INTERNAL_SERVER_ERROR),
    AI_API_NO_RESPONSE(5002, "AI API returned no response", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_AI_LABEL(5003, "Invalid AI label returned", HttpStatus.BAD_REQUEST),

    CLASSIFICATION_NOT_EXISTED(4004, "No classification available for this patient", HttpStatus.NOT_FOUND),
    // File processing errors
    INVALID_FILE(4001, "File không hợp lệ", HttpStatus.BAD_REQUEST),
    INVALID_FILE_TYPE(4002, "Loại file không được hỗ trợ. Chỉ chấp nhận file ảnh (JPG, PNG)", HttpStatus.BAD_REQUEST),
    FILE_SIZE_EXCEEDED(4003, "Kích thước file vượt quá giới hạn cho phép", HttpStatus.BAD_REQUEST),
    FILE_PROCESSING_ERROR(4004, "Lỗi khi xử lý file", HttpStatus.BAD_REQUEST),

    // AI Image API errors
    AI_IMAGE_API_ERROR(5001, "Lỗi khi gọi AI Image Analysis API", HttpStatus.BAD_REQUEST),
    AI_IMAGE_API_NO_RESPONSE(5002, "AI Image Analysis API không trả về kết quả", HttpStatus.BAD_REQUEST),

    MESSAGE_NOT_EXISTED(4005, "Message does not exist", HttpStatus.NOT_FOUND),
    MESSAGE_CLASSIFICATION_NOT_EXISTED(4005, "Message classification does not exist", HttpStatus.NOT_FOUND),

    LEARNING_PATH_NOT_FOUND(7001, "No active learning path found", HttpStatus.NOT_FOUND),
    INVALID_TARGET_SCORE(7002, "Target score must be in range 10-990", HttpStatus.BAD_REQUEST),
    INVALID_LEARNING_PATH_DATA(7003, "Invalid learning path data", HttpStatus.BAD_REQUEST),
    LEARNING_PATH_CODE_EXISTED(7004, "Learning path code already exists", HttpStatus.BAD_REQUEST),
    INVALID_TOKEN(7005, "Invalid or missing bearer token", HttpStatus.UNAUTHORIZED),
    INVALID_FLASHCARD_DATA(7006, "Invalid flashcard data", HttpStatus.BAD_REQUEST),
    LEARNING_MODULE_NOT_FOUND(7007, "Learning module not found", HttpStatus.NOT_FOUND),
    FLASHCARD_NOT_FOUND(7008, "Flashcard not found", HttpStatus.NOT_FOUND),
    INVALID_LEARNING_MODULE_DATA(7009, "Invalid learning module data", HttpStatus.BAD_REQUEST),
    LEARNING_MODULE_TITLE_EXISTED(7010, "Learning module title already exists", HttpStatus.BAD_REQUEST),
    LEARNING_PATH_MILESTONE_NOT_FOUND(7011, "Learning path milestone not found", HttpStatus.NOT_FOUND),
    INVALID_LEARNING_PATH_MILESTONE_DATA(7012, "Invalid learning path milestone data", HttpStatus.BAD_REQUEST),
    MILESTONE_MODULE_NOT_FOUND(7013, "Milestone module not found", HttpStatus.NOT_FOUND),
    INVALID_MILESTONE_MODULE_DATA(7014, "Invalid milestone module data", HttpStatus.BAD_REQUEST),
    MILESTONE_MODULE_EXISTED(7015, "Module already linked to milestone", HttpStatus.BAD_REQUEST),
    VIDEO_LESSON_NOT_FOUND(7016, "Video lesson not found", HttpStatus.NOT_FOUND),
    INVALID_VIDEO_LESSON_DATA(7017, "Invalid video lesson data", HttpStatus.BAD_REQUEST),
    PRACTICE_SET_NOT_FOUND(7018, "Practice set not found", HttpStatus.NOT_FOUND),
    INVALID_PRACTICE_SET_DATA(7019, "Invalid practice set data", HttpStatus.BAD_REQUEST),
    QUESTION_NOT_FOUND(7020, "Question not found", HttpStatus.NOT_FOUND),
    INVALID_QUESTION_DATA(7021, "Invalid question data", HttpStatus.BAD_REQUEST),
    INVALID_PROGRESS_DATA(7022, "Invalid learning progress data", HttpStatus.BAD_REQUEST),
    VIDEO_UPLOAD_FAILED(7023, "Video upload failed", HttpStatus.BAD_REQUEST),
    VIDEO_UPLOAD_CONFIG_MISSING(7024, "Cloud upload config missing", HttpStatus.BAD_REQUEST);

    int code;
    String message;
    HttpStatus status;

    public HttpStatus getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public int getCode() {
        return code;
    }
}
