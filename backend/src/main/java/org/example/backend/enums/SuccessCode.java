package org.example.backend.enums;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)

public enum SuccessCode {
    // --- CREATE (1000 - 1009) ---
    DEVICE_CREATED(1001, "Device created successfully", HttpStatus.CREATED),
    PATIENT_CREATED(1002, "Patient created successfully", HttpStatus.CREATED),
    DOCTOR_CREATED(1003, "Doctor created successfully", HttpStatus.CREATED),
    MEDICAL_ENCOUNTER_CREATED(1004, "MedicalEncounter created successfully", HttpStatus.CREATED),


    ARTICLE_GET(1013, "Article get successfully", HttpStatus.OK),
    ARTICLE_LISTED(1013, "Article listed successfully", HttpStatus.OK),
    ARTICLE_CREATED(1005, "Article created successfully", HttpStatus.CREATED),
    // --- LIST (1010 - 1019) ---
    DELETE_MEDICAL_ENCOUNTER(2003, "Medical encounter deleted successfully", HttpStatus.OK),

    MEDICAL_ENCOUNTER_LISTED(1010, "MedicalEncounter Device listed successfully", HttpStatus.OK),
    PATIENT_LISTED(1011, "Patient Device listed successfully", HttpStatus.OK),
    DOCTOR_LISTED(1012, "Doctor Device listed successfully", HttpStatus.OK),

    // --- GET (1020 - 1029) ---
    PATIENT_GET(1020, "Patient get successfully", HttpStatus.OK),
    DOCTOR_GET(1021, "Doctor get successfully", HttpStatus.OK),

    // --- UPDATE (1030 - 1039) ---
    // Thêm các mã cập nhật thành công
    PATIENT_UPDATED(1030, "Patient updated successfully", HttpStatus.OK),
    PASSWORD_UPDATED(1030, "Password updated successfully", HttpStatus.OK),
    DOCTOR_UPDATED(1031, "Doctor updated successfully", HttpStatus.OK),
    DEVICE_UPDATED(1032, "Device updated successfully", HttpStatus.OK),

    // --- AUTH & ANALYSIS (1040 - 1049) ---
    LOGIN_SUCCESS(1040, "Login successfully", HttpStatus.OK),
    ANALYZE_SUCCESS(1041, "Image analysis completed successfully", HttpStatus.OK),
    USER_CREATED(1042, "User created successfully", HttpStatus.CREATED),
    LOGOUT_SUCCESS(1052, "Logout successfully", HttpStatus.OK),
    ADMIN_CREATED(1050, "Admin created successfully", HttpStatus.CREATED),
    USER_INFO_RETRIEVED(1051, "User info retrieved successfully", HttpStatus.OK),
    FLASHCARD_CREATED(1053, "Flashcard created successfully", HttpStatus.CREATED),
    FLASHCARD_LISTED(1054, "Flashcards listed successfully", HttpStatus.OK),
    FLASHCARD_UPDATED(1055, "Flashcard updated successfully", HttpStatus.OK),
    FLASHCARD_DELETED(1056, "Flashcard deleted successfully", HttpStatus.OK),
    LEARNING_MODULE_CREATED(1057, "Learning module created successfully", HttpStatus.CREATED),
    LEARNING_MODULE_UPDATED(1058, "Learning module updated successfully", HttpStatus.OK),
    LEARNING_MODULE_DEACTIVATED(1059, "Learning module deactivated successfully", HttpStatus.OK),
    LEARNING_MODULE_LISTED(1084, "Learning modules listed successfully", HttpStatus.OK),
    LEARNING_MODULE_GET(1085, "Learning module retrieved successfully", HttpStatus.OK),
    LEARNING_PATH_ASSIGNED(1043, "Learning path assigned successfully", HttpStatus.OK),
    TARGET_SCORE_UPDATED(1044, "Target score updated successfully", HttpStatus.OK),
    LEARNING_PATH_CREATED(1045, "Learning path created successfully", HttpStatus.CREATED),
    LEARNING_PATH_LISTED(1046, "Learning paths listed successfully", HttpStatus.OK),
    LEARNING_PATH_GET(1047, "Learning path retrieved successfully", HttpStatus.OK),
    LEARNING_PATH_UPDATED(1048, "Learning path updated successfully", HttpStatus.OK),
    LEARNING_PATH_DEACTIVATED(1049, "Learning path deactivated successfully", HttpStatus.OK),
    LEARNING_PATH_DELETED(1076, "Learning path deleted successfully", HttpStatus.OK),
    LEARNING_PATH_MILESTONE_CREATED(1060, "Learning path milestone created successfully", HttpStatus.CREATED),
    LEARNING_PATH_MILESTONE_LISTED(1061, "Learning path milestones listed successfully", HttpStatus.OK),
    LEARNING_PATH_MILESTONE_UPDATED(1062, "Learning path milestone updated successfully", HttpStatus.OK),
    LEARNING_PATH_MILESTONE_DELETED(1063, "Learning path milestone deleted successfully", HttpStatus.OK),
    MILESTONE_MODULE_CREATED(1064, "Milestone module created successfully", HttpStatus.CREATED),
    MILESTONE_MODULE_LISTED(1065, "Milestone modules listed successfully", HttpStatus.OK),
    MILESTONE_MODULE_UPDATED(1066, "Milestone module updated successfully", HttpStatus.OK),
    MILESTONE_MODULE_DELETED(1067, "Milestone module deleted successfully", HttpStatus.OK),
    VIDEO_LESSON_CREATED(1068, "Video lesson created successfully", HttpStatus.CREATED),
    VIDEO_LESSON_UPDATED(1069, "Video lesson updated successfully", HttpStatus.OK),
    VIDEO_LESSON_DELETED(1070, "Video lesson deleted successfully", HttpStatus.OK),
    VIDEO_LESSON_LISTED(1071, "Video lessons listed successfully", HttpStatus.OK),
    PRACTICE_SET_CREATED(1072, "Practice set created successfully", HttpStatus.CREATED),
    PRACTICE_SET_UPDATED(1073, "Practice set updated successfully", HttpStatus.OK),
    PRACTICE_SET_DELETED(1074, "Practice set deleted successfully", HttpStatus.OK),
    PRACTICE_SET_LISTED(1075, "Practice sets listed successfully", HttpStatus.OK),
    QUESTION_CREATED(1077, "Question created successfully", HttpStatus.CREATED),
    QUESTION_LISTED(1078, "Questions listed successfully", HttpStatus.OK),
    QUESTION_GET(1079, "Question retrieved successfully", HttpStatus.OK),
    QUESTION_UPDATED(1080, "Question updated successfully", HttpStatus.OK),
    QUESTION_DELETED(1081, "Question deleted successfully", HttpStatus.OK),
    PRACTICE_SET_QUESTION_ASSIGNED(1082, "Practice set questions assigned successfully", HttpStatus.OK),
    PRACTICE_SET_QUESTION_LISTED(1083, "Practice set questions listed successfully", HttpStatus.OK),
    USER_LESSON_PROGRESS_UPDATED(1086, "User lesson progress updated successfully", HttpStatus.OK),
    USER_MODULE_PROGRESS_UPDATED(1087, "User module progress updated successfully", HttpStatus.OK),
    VIDEO_FILE_UPLOADED(1088, "Video file uploaded successfully", HttpStatus.OK),

    // --- Message codes (2001-2020) ---
    SEND_MESSAGE_SUCCESS(2001, "Message sent successfully", HttpStatus.OK),
    GET_MESSAGES_SUCCESS(2002, "Messages retrieved successfully", HttpStatus.OK),
    DELETE_MESSAGE_SUCCESS(2003, "Message deleted successfully", HttpStatus.OK),
    DELETE_MESSAGES_SUCCESS(2004, "Messages deleted successfully", HttpStatus.OK),
    USER_JOINED_SUCCESS(2005, "User joined chat room successfully", HttpStatus.OK),
    USER_LEFT_SUCCESS(2006, "User left chat room successfully", HttpStatus.OK),
    MESSAGE_MARKED_READ(2007, "Message marked as read successfully", HttpStatus.OK),
    ALL_MESSAGES_MARKED_READ(2008, "All messages marked as read successfully", HttpStatus.OK),
    GET_ROOMS_SUCCESS(2009, "Rooms retrieved successfully", HttpStatus.OK),
    GET_UNREAD_COUNT_SUCCESS(2010, "Unread count retrieved successfully", HttpStatus.OK),

    FLASHCARD_COLLECTION_CREATED(1089, "Flashcard collection created successfully", HttpStatus.CREATED),
    FLASHCARD_COLLECTION_UPDATED(1090, "Flashcard collection updated successfully", HttpStatus.OK),
    FLASHCARD_COLLECTION_DELETED(1091, "Flashcard collection deleted successfully", HttpStatus.OK),
    FLASHCARD_COLLECTION_LISTED(1092, "Flashcard collections listed successfully", HttpStatus.OK),

    PATIENT_CLASSIFICATION_DELETED(1023, "Xóa phân loại bệnh nhân thành công", HttpStatus.OK),
    CLASSIFICATION_RETRIEVED(1022, "Lấy thông tin phân loại thành công", HttpStatus.OK),
    MESSAGE_CLASSIFIED(1021, "Phân loại tin nhắn thành công", HttpStatus.OK);

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
