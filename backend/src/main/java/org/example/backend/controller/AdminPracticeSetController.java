package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.AssignPracticeSetQuestionsRequest;
import org.example.backend.dto.request.CreatePracticeSetRequest;
import org.example.backend.dto.request.UpdatePracticeSetRequest;
import org.example.backend.dto.response.ApiResponse;
import org.example.backend.dto.response.PracticeSetQuestionDetailResponse;
import org.example.backend.dto.response.PracticeSetResponse;
import org.example.backend.enums.SuccessCode;
import org.example.backend.service.AdminPracticeSetService;
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
@RequestMapping("/admin/practice-sets")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminPracticeSetController {

    private final AdminPracticeSetService adminPracticeSetService;

    @PostMapping
    public ResponseEntity<ApiResponse<PracticeSetResponse>> createPracticeSet(@RequestBody CreatePracticeSetRequest request) {
        PracticeSetResponse response = adminPracticeSetService.createPracticeSet(request);
        return ApiResponseUtil.success(response, SuccessCode.PRACTICE_SET_CREATED);
    }

    @GetMapping("/modules/{moduleId}")
    public ResponseEntity<ApiResponse<List<PracticeSetResponse>>> getPracticeSetsByModule(@PathVariable Long moduleId) {
        List<PracticeSetResponse> response = adminPracticeSetService.getPracticeSetsByModule(moduleId);
        return ApiResponseUtil.success(response, SuccessCode.PRACTICE_SET_LISTED);
    }

    @PutMapping("/{practiceSetId}")
    public ResponseEntity<ApiResponse<PracticeSetResponse>> updatePracticeSet(
            @PathVariable Long practiceSetId,
            @RequestBody UpdatePracticeSetRequest request
    ) {
        PracticeSetResponse response = adminPracticeSetService.updatePracticeSet(practiceSetId, request);
        return ApiResponseUtil.success(response, SuccessCode.PRACTICE_SET_UPDATED);
    }

    @DeleteMapping("/{practiceSetId}")
    public ResponseEntity<ApiResponse<Void>> deletePracticeSet(@PathVariable Long practiceSetId) {
        adminPracticeSetService.deletePracticeSet(practiceSetId);
        return ApiResponseUtil.success(SuccessCode.PRACTICE_SET_DELETED);
    }

    @PostMapping("/{practiceSetId}/questions")
    public ResponseEntity<ApiResponse<List<PracticeSetQuestionDetailResponse>>> assignQuestionsToPracticeSet(
            @PathVariable Long practiceSetId,
            @RequestBody AssignPracticeSetQuestionsRequest request
    ) {
        List<PracticeSetQuestionDetailResponse> response =
                adminPracticeSetService.assignQuestionsToPracticeSet(practiceSetId, request);
        return ApiResponseUtil.success(response, SuccessCode.PRACTICE_SET_QUESTION_ASSIGNED);
    }

    @GetMapping("/{practiceSetId}/questions")
    public ResponseEntity<ApiResponse<List<PracticeSetQuestionDetailResponse>>> getPracticeSetQuestions(
            @PathVariable Long practiceSetId
    ) {
        List<PracticeSetQuestionDetailResponse> response = adminPracticeSetService.getPracticeSetQuestions(practiceSetId);
        return ApiResponseUtil.success(response, SuccessCode.PRACTICE_SET_QUESTION_LISTED);
    }
}

