package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.UpdateLessonProgressRequest;
import org.example.backend.dto.response.ApiResponse;
import org.example.backend.dto.response.LessonProgressUpdateResponse;
import org.example.backend.dto.response.UserLessonResponse;
import org.example.backend.enums.SuccessCode;
import org.example.backend.service.UserLessonService;
import org.example.backend.service.UserProgressService;
import org.example.backend.util.ApiResponseUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users/lessons")
@RequiredArgsConstructor
public class UserLessonController {

    private final UserLessonService userLessonService;
    private final UserProgressService userProgressService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<UserLessonResponse>>> getLessons(
            Authentication authentication,
            @RequestParam(required = false) Long moduleId
    ) {
        List<UserLessonResponse> response = userLessonService.getLessonsForUser(authentication.getName(), moduleId);
        return ApiResponseUtil.success(response, SuccessCode.VIDEO_LESSON_LISTED);
    }

    @PostMapping("/{lessonId}/progress")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<LessonProgressUpdateResponse>> updateLessonProgress(
            Authentication authentication,
            @PathVariable Long lessonId,
            @RequestBody(required = false) UpdateLessonProgressRequest request
    ) {
        LessonProgressUpdateResponse response = userProgressService.updateLessonProgress(
                authentication.getName(),
                lessonId,
                request
        );
        return ApiResponseUtil.success(response, SuccessCode.USER_LESSON_PROGRESS_UPDATED);
    }
}
