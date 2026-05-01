package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.response.ApiResponse;
import org.example.backend.dto.response.UserLearningPathResponse;
import org.example.backend.enums.SuccessCode;
import org.example.backend.service.PlacementOnboardingService;
import org.example.backend.util.ApiResponseUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/placement-onboarding")
@RequiredArgsConstructor
public class PlacementOnboardingController {

    private final PlacementOnboardingService placementOnboardingService;

    @PostMapping("/assign-path")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<UserLearningPathResponse>> assignRecommendedPath(Authentication authentication) {
        UserLearningPathResponse response = placementOnboardingService.assignRecommendedLearningPath(authentication.getName());
        return ApiResponseUtil.success(response, SuccessCode.LEARNING_PATH_ASSIGNED);
    }
}

