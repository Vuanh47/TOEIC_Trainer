package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CompleteModuleRequest;
import org.example.backend.dto.response.ApiResponse;
import org.example.backend.dto.response.ModuleUnlockResponse;
import org.example.backend.dto.response.UserModuleContentResponse;
import org.example.backend.dto.response.UserRoadmapResponse;
import org.example.backend.enums.SuccessCode;
import org.example.backend.service.UserLearningService;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users/learning")
@RequiredArgsConstructor
public class UserLearningController {

    private final UserLearningService userLearningService;
    private final UserProgressService userProgressService;

    @GetMapping("/roadmap")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<UserRoadmapResponse>> getActiveRoadmap(Authentication authentication) {
        UserRoadmapResponse response = userLearningService.getActiveRoadmap(authentication.getName());
        return ApiResponseUtil.success(response, SuccessCode.LEARNING_PATH_GET);
    }

    @GetMapping("/modules/{moduleId}/content")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<UserModuleContentResponse>> getModuleContent(
            Authentication authentication,
            @PathVariable Long moduleId
    ) {
        UserModuleContentResponse response = userLearningService.getModuleContent(authentication.getName(), moduleId);
        return ApiResponseUtil.success(response, SuccessCode.LEARNING_MODULE_GET);
    }

    @PostMapping("/modules/{moduleId}/complete-or-unlock-next")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<ModuleUnlockResponse>> completeOrUnlockNext(
            Authentication authentication,
            @PathVariable Long moduleId,
            @RequestBody(required = false) CompleteModuleRequest request
    ) {
        ModuleUnlockResponse response = userProgressService.completeOrUnlockNextModule(
                authentication.getName(),
                moduleId,
                request
        );
        return ApiResponseUtil.success(response, SuccessCode.USER_MODULE_PROGRESS_UPDATED);
    }
}
