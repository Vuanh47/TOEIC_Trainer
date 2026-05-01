package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateVideoLessonRequest;
import org.example.backend.dto.request.UpdateVideoLessonRequest;
import org.example.backend.dto.response.ApiResponse;
import org.example.backend.dto.response.VideoLessonResponse;
import org.example.backend.enums.SuccessCode;
import org.example.backend.service.AdminVideoLessonService;
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

import java.util.List;

@RestController
@RequestMapping("/admin/video-lessons")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminVideoLessonController {

    private final AdminVideoLessonService adminVideoLessonService;

    @PostMapping
    public ResponseEntity<ApiResponse<VideoLessonResponse>> createVideoLesson(@RequestBody CreateVideoLessonRequest request) {
        VideoLessonResponse response = adminVideoLessonService.createVideoLesson(request);
        return ApiResponseUtil.success(response, SuccessCode.VIDEO_LESSON_CREATED);
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

