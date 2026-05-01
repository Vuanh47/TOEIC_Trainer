package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend.dto.request.CreateVideoLessonRequest;
import org.example.backend.dto.request.UpdateVideoLessonRequest;
import org.example.backend.dto.request.UploadAndCreateVideoLessonRequest;
import org.example.backend.dto.response.ApiResponse;
import org.example.backend.enums.ErrorCode;
import org.example.backend.dto.response.VideoUploadResponse;
import org.example.backend.dto.response.VideoLessonResponse;
import org.example.backend.enums.SuccessCode;
import org.example.backend.service.AdminVideoLessonService;
import org.example.backend.service.CloudinaryUploadService;
import org.example.backend.util.ApiResponseUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/admin/video-lessons")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminVideoLessonController {

    private final AdminVideoLessonService adminVideoLessonService;
    private final CloudinaryUploadService cloudinaryUploadService;
    private final ObjectMapper objectMapper;

    @PostMapping("/upload-and-create")
    public ResponseEntity<ApiResponse<VideoLessonResponse>> uploadAndCreateVideoLesson(
            @RequestPart("file") MultipartFile file,
            @RequestPart("data") String dataJson) {
        // Validate file size before uploading (1GB limit configured in application.yaml)
        long maxBytes = 1L * 1024 * 1024 * 1024; // 1GB
        if (file == null || file.isEmpty()) {
            return ApiResponseUtil.error(null, ErrorCode.VIDEO_UPLOAD_FAILED);
        }

        if (file.getSize() > maxBytes) {
            return ApiResponseUtil.error(null, ErrorCode.FILE_SIZE_EXCEEDED);
        }

        UploadAndCreateVideoLessonRequest request;
        try {
            request = objectMapper.readValue(dataJson, UploadAndCreateVideoLessonRequest.class);
        } catch (Exception ex) {
            return ApiResponseUtil.error(null, ErrorCode.INVALID_VIDEO_LESSON_DATA);
        }

        VideoLessonResponse response = adminVideoLessonService.uploadAndCreateVideoLesson(file, request);
        return ApiResponseUtil.success(response, SuccessCode.VIDEO_LESSON_CREATED);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VideoLessonResponse>> createVideoLesson(@RequestBody CreateVideoLessonRequest request) {
        VideoLessonResponse response = adminVideoLessonService.createVideoLesson(request);
        return ApiResponseUtil.success(response, SuccessCode.VIDEO_LESSON_CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<VideoLessonResponse>>> getAllVideoLessons() {
        List<VideoLessonResponse> response = adminVideoLessonService.getAllVideoLessons();
        return ApiResponseUtil.success(response, SuccessCode.VIDEO_LESSON_LISTED);
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<VideoUploadResponse>> uploadVideo(@RequestParam("file") MultipartFile file) {
        // Validate file size before uploading (1GB limit configured in application.yaml)
        long maxBytes = 1L * 1024 * 1024 * 1024; // 1GB
        if (file == null || file.isEmpty()) {
            return ApiResponseUtil.error(null, ErrorCode.VIDEO_UPLOAD_FAILED);
        }

        if (file.getSize() > maxBytes) {
            return ApiResponseUtil.error(null, ErrorCode.FILE_SIZE_EXCEEDED);
        }

        VideoUploadResponse response = cloudinaryUploadService.uploadVideo(file);
        return ApiResponseUtil.success(response, SuccessCode.VIDEO_FILE_UPLOADED);
    }

    @GetMapping("/modules/{moduleId}")
    public ResponseEntity<ApiResponse<List<VideoLessonResponse>>> getVideoLessonsByModule(@PathVariable Long moduleId) {
        List<VideoLessonResponse> response = adminVideoLessonService.getVideoLessonsByModule(moduleId);
        return ApiResponseUtil.success(response, SuccessCode.VIDEO_LESSON_LISTED);
    }

    @PutMapping("/{videoLessonId}")
    public ResponseEntity<ApiResponse<VideoLessonResponse>> updateVideoLesson(
            @PathVariable Long videoLessonId,
            @RequestBody UpdateVideoLessonRequest request
    ) {
        VideoLessonResponse response = adminVideoLessonService.updateVideoLesson(videoLessonId, request);
        return ApiResponseUtil.success(response, SuccessCode.VIDEO_LESSON_UPDATED);
    }

    @DeleteMapping("/{videoLessonId}")
    public ResponseEntity<ApiResponse<Void>> deleteVideoLesson(@PathVariable Long videoLessonId) {
        adminVideoLessonService.deleteVideoLesson(videoLessonId);
        return ApiResponseUtil.success(SuccessCode.VIDEO_LESSON_DELETED);
    }
}

