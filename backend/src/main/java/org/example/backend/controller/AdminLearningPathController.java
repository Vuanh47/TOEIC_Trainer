package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateLearningPathRequest;
import org.example.backend.dto.request.UpdateLearningPathRequest;
import org.example.backend.dto.response.ApiResponse;
import org.example.backend.dto.response.LearningPathResponse;
import org.example.backend.enums.SuccessCode;
import org.example.backend.service.AdminLearningPathService;
import org.example.backend.util.ApiResponseUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/learning-paths")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminLearningPathController {

    private final AdminLearningPathService adminLearningPathService;

    @PostMapping
    public ResponseEntity<ApiResponse<LearningPathResponse>> createLearningPath(
            @RequestBody CreateLearningPathRequest request
    ) {
        LearningPathResponse response = adminLearningPathService.createLearningPath(request);
        return ApiResponseUtil.success(response, SuccessCode.LEARNING_PATH_CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LearningPathResponse>>> getAllLearningPaths() {
        List<LearningPathResponse> response = adminLearningPathService.getAllLearningPaths();
        return ApiResponseUtil.success(response, SuccessCode.LEARNING_PATH_LISTED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LearningPathResponse>> getLearningPathById(@PathVariable Long id) {
        LearningPathResponse response = adminLearningPathService.getLearningPathById(id);
        return ApiResponseUtil.success(response, SuccessCode.LEARNING_PATH_GET);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LearningPathResponse>> updateLearningPath(
            @PathVariable Long id,
            @RequestBody UpdateLearningPathRequest request
    ) {
        LearningPathResponse response = adminLearningPathService.updateLearningPath(id, request);
        return ApiResponseUtil.success(response, SuccessCode.LEARNING_PATH_UPDATED);
    }

    @DeleteMapping("/deactive/{id}")
    public ResponseEntity<ApiResponse<Void>> deactivateLearningPath(@PathVariable Long id) {
        adminLearningPathService.deactivateLearningPath(id);
        return ApiResponseUtil.success(SuccessCode.LEARNING_PATH_DEACTIVATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLearningPath(@PathVariable Long id) {
        adminLearningPathService.deleteLearningPath(id);
        return ApiResponseUtil.success(SuccessCode.LEARNING_PATH_DELETED);
    }
}
