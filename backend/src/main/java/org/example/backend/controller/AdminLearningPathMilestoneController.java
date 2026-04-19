package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateLearningPathMilestoneRequest;
import org.example.backend.dto.request.UpdateLearningPathMilestoneRequest;
import org.example.backend.dto.response.ApiResponse;
import org.example.backend.dto.response.LearningPathMilestoneResponse;
import org.example.backend.enums.SuccessCode;
import org.example.backend.service.AdminLearningPathMilestoneService;
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
@RequestMapping("/admin/learning-paths/{learningPathId}/milestones")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminLearningPathMilestoneController {

    private final AdminLearningPathMilestoneService adminLearningPathMilestoneService;

    @PostMapping
    public ResponseEntity<ApiResponse<LearningPathMilestoneResponse>> createMilestone(
            @PathVariable Long learningPathId,
            @RequestBody CreateLearningPathMilestoneRequest request
    ) {
        LearningPathMilestoneResponse response = adminLearningPathMilestoneService.createMilestone(learningPathId, request);
        return ApiResponseUtil.success(response, SuccessCode.LEARNING_PATH_MILESTONE_CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LearningPathMilestoneResponse>>> getMilestonesByPathId(
            @PathVariable Long learningPathId
    ) {
        List<LearningPathMilestoneResponse> response = adminLearningPathMilestoneService.getMilestonesByPathId(learningPathId);
        return ApiResponseUtil.success(response, SuccessCode.LEARNING_PATH_MILESTONE_LISTED);
    }

    @PutMapping("/{milestoneId}")
    public ResponseEntity<ApiResponse<LearningPathMilestoneResponse>> updateMilestone(
            @PathVariable Long learningPathId,
            @PathVariable Long milestoneId,
            @RequestBody UpdateLearningPathMilestoneRequest request
    ) {
        LearningPathMilestoneResponse response = adminLearningPathMilestoneService.updateMilestone(
                learningPathId,
                milestoneId,
                request
        );
        return ApiResponseUtil.success(response, SuccessCode.LEARNING_PATH_MILESTONE_UPDATED);
    }

    @DeleteMapping("/{milestoneId}")
    public ResponseEntity<ApiResponse<Void>> deleteMilestone(
            @PathVariable Long learningPathId,
            @PathVariable Long milestoneId
    ) {
        adminLearningPathMilestoneService.deleteMilestone(learningPathId, milestoneId);
        return ApiResponseUtil.success(SuccessCode.LEARNING_PATH_MILESTONE_DELETED);
    }
}

