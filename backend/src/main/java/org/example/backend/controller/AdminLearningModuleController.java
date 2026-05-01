package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateLearningModuleRequest;
import org.example.backend.dto.request.UpdateLearningModuleRequest;
import org.example.backend.dto.response.ApiResponse;
import org.example.backend.dto.response.LearningModuleResponse;
import org.example.backend.enums.SuccessCode;
import org.example.backend.service.AdminLearningModuleService;
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
@RequestMapping("/admin/learning-modules")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminLearningModuleController {

    private final AdminLearningModuleService adminLearningModuleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LearningModuleResponse>>> getAllLearningModules() {
        List<LearningModuleResponse> response = adminLearningModuleService.getAllLearningModules();
        return ApiResponseUtil.success(response, SuccessCode.LEARNING_MODULE_LISTED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LearningModuleResponse>> getLearningModuleById(@PathVariable Long id) {
        LearningModuleResponse response = adminLearningModuleService.getLearningModuleById(id);
        return ApiResponseUtil.success(response, SuccessCode.LEARNING_MODULE_GET);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LearningModuleResponse>> createLearningModule(
            @RequestBody CreateLearningModuleRequest request
    ) {
        LearningModuleResponse response = adminLearningModuleService.createLearningModule(request);
        return ApiResponseUtil.success(response, SuccessCode.LEARNING_MODULE_CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LearningModuleResponse>> updateLearningModule(
            @PathVariable Long id,
            @RequestBody UpdateLearningModuleRequest request
    ) {
        LearningModuleResponse response = adminLearningModuleService.updateLearningModule(id, request);
        return ApiResponseUtil.success(response, SuccessCode.LEARNING_MODULE_UPDATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deactivateLearningModule(@PathVariable Long id) {
        adminLearningModuleService.deactivateLearningModule(id);
        return ApiResponseUtil.success(SuccessCode.LEARNING_MODULE_DEACTIVATED);
    }
}

