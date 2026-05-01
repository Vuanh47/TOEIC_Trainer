package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateMilestoneModuleRequest;
import org.example.backend.dto.request.UpdateMilestoneModuleRequest;
import org.example.backend.dto.response.ApiResponse;
import org.example.backend.dto.response.MilestoneModuleResponse;
import org.example.backend.enums.SuccessCode;
import org.example.backend.service.AdminMilestoneModuleService;
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
@RequestMapping("/admin/milestones/{milestoneId}/modules")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminMilestoneModuleController {

    private final AdminMilestoneModuleService adminMilestoneModuleService;

    @PostMapping
    public ResponseEntity<ApiResponse<MilestoneModuleResponse>> addModuleToMilestone(
            @PathVariable Long milestoneId,
            @RequestBody CreateMilestoneModuleRequest request
    ) {
        MilestoneModuleResponse response = adminMilestoneModuleService.addModuleToMilestone(milestoneId, request);
        return ApiResponseUtil.success(response, SuccessCode.MILESTONE_MODULE_CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MilestoneModuleResponse>>> getModulesByMilestoneId(@PathVariable Long milestoneId) {
        List<MilestoneModuleResponse> response = adminMilestoneModuleService.getModulesByMilestoneId(milestoneId);
        return ApiResponseUtil.success(response, SuccessCode.MILESTONE_MODULE_LISTED);
    }

    @PutMapping("/{milestoneModuleId}")
    public ResponseEntity<ApiResponse<MilestoneModuleResponse>> updateMilestoneModule(
            @PathVariable Long milestoneId,
            @PathVariable Long milestoneModuleId,
            @RequestBody UpdateMilestoneModuleRequest request
    ) {
        MilestoneModuleResponse response = adminMilestoneModuleService.updateMilestoneModule(
                milestoneId,
                milestoneModuleId,
                request
        );
        return ApiResponseUtil.success(response, SuccessCode.MILESTONE_MODULE_UPDATED);
    }

    @DeleteMapping("/{milestoneModuleId}")
    public ResponseEntity<ApiResponse<Void>> removeMilestoneModule(
            @PathVariable Long milestoneId,
            @PathVariable Long milestoneModuleId
    ) {
        adminMilestoneModuleService.removeMilestoneModule(milestoneId, milestoneModuleId);
        return ApiResponseUtil.success(SuccessCode.MILESTONE_MODULE_DELETED);
    }
}

