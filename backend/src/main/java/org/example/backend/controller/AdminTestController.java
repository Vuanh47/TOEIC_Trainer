package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.AssignTestPartQuestionsRequest;
import org.example.backend.dto.request.CreateTestPartRequest;
import org.example.backend.dto.request.CreateTestRequest;
import org.example.backend.dto.request.UpdateTestPartRequest;
import org.example.backend.dto.request.UpdateTestRequest;
import org.example.backend.dto.response.ApiResponse;
import org.example.backend.dto.response.TestResponse;
import org.example.backend.dto.response.TestPartResponse;
import org.example.backend.dto.response.TestPartQuestionResponse;
import org.example.backend.enums.SuccessCode;
import org.example.backend.service.AdminTestService;
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
@RequestMapping("/admin/tests")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminTestController {

    private final AdminTestService adminTestService;

    // ===== Test Management =====

    @PostMapping
    public ResponseEntity<ApiResponse<TestResponse>> createTest(@RequestBody CreateTestRequest request) {
        TestResponse response = adminTestService.createTest(request);
        return ApiResponseUtil.success(response, SuccessCode.TEST_CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TestResponse>>> getAllTests() {
        List<TestResponse> response = adminTestService.getAllTests();
        return ApiResponseUtil.success(response, SuccessCode.TEST_LISTED);
    }

    @GetMapping("/published")
    public ResponseEntity<ApiResponse<List<TestResponse>>> getPublishedTests() {
        List<TestResponse> response = adminTestService.getPublishedTests();
        return ApiResponseUtil.success(response, SuccessCode.TEST_LISTED);
    }

    @GetMapping("/{testId}")
    public ResponseEntity<ApiResponse<TestResponse>> getTestById(@PathVariable Long testId) {
        TestResponse response = adminTestService.getTestById(testId);
        return ApiResponseUtil.success(response, SuccessCode.TEST_GET);
    }

    @PutMapping("/{testId}")
    public ResponseEntity<ApiResponse<TestResponse>> updateTest(
            @PathVariable Long testId,
            @RequestBody UpdateTestRequest request
    ) {
        TestResponse response = adminTestService.updateTest(testId, request);
        return ApiResponseUtil.success(response, SuccessCode.TEST_UPDATED);
    }

    @DeleteMapping("/{testId}")
    public ResponseEntity<ApiResponse<Void>> deleteTest(@PathVariable Long testId) {
        adminTestService.deleteTest(testId);
        return ApiResponseUtil.success(SuccessCode.TEST_DELETED);
    }

    // ===== TestPart Management =====

    @PostMapping("/{testId}/parts")
    public ResponseEntity<ApiResponse<TestPartResponse>> createTestPart(
            @PathVariable Long testId,
            @RequestBody CreateTestPartRequest request
    ) {
        TestPartResponse response = adminTestService.createTestPart(testId, request);
        return ApiResponseUtil.success(response, SuccessCode.TEST_PART_CREATED);
    }

    @GetMapping("/{testId}/parts")
    public ResponseEntity<ApiResponse<List<TestPartResponse>>> getTestParts(@PathVariable Long testId) {
        List<TestPartResponse> response = adminTestService.getTestParts(testId);
        return ApiResponseUtil.success(response, SuccessCode.TEST_PART_LISTED);
    }

    @PutMapping("/parts/{testPartId}")
    public ResponseEntity<ApiResponse<TestPartResponse>> updateTestPart(
            @PathVariable Long testPartId,
            @RequestBody UpdateTestPartRequest request
    ) {
        TestPartResponse response = adminTestService.updateTestPart(testPartId, request);
        return ApiResponseUtil.success(response, SuccessCode.TEST_PART_UPDATED);
    }

    @DeleteMapping("/parts/{testPartId}")
    public ResponseEntity<ApiResponse<Void>> deleteTestPart(@PathVariable Long testPartId) {
        adminTestService.deleteTestPart(testPartId);
        return ApiResponseUtil.success(SuccessCode.TEST_PART_DELETED);
    }

    // ===== TestPart Questions Management =====

    @PostMapping("/parts/{testPartId}/questions")
    public ResponseEntity<ApiResponse<List<TestPartQuestionResponse>>> assignQuestionsToTestPart(
            @PathVariable Long testPartId,
            @RequestBody AssignTestPartQuestionsRequest request
    ) {
        List<TestPartQuestionResponse> response = adminTestService.assignQuestionsToTestPart(testPartId, request);
        return ApiResponseUtil.success(response, SuccessCode.TEST_PART_QUESTION_ASSIGNED);
    }

    @GetMapping("/parts/{testPartId}/questions")
    public ResponseEntity<ApiResponse<List<TestPartQuestionResponse>>> getTestPartQuestions(@PathVariable Long testPartId) {
        List<TestPartQuestionResponse> response = adminTestService.getTestPartQuestions(testPartId);
        return ApiResponseUtil.success(response, SuccessCode.TEST_PART_QUESTION_LISTED);
    }

    @DeleteMapping("/parts/{testPartId}/questions/{testPartQuestionId}")
    public ResponseEntity<ApiResponse<Void>> removeQuestionFromTestPart(
            @PathVariable Long testPartId,
            @PathVariable Long testPartQuestionId
    ) {
        adminTestService.removeQuestionFromTestPart(testPartId, testPartQuestionId);
        return ApiResponseUtil.success(SuccessCode.TEST_PART_QUESTION_DELETED);
    }
}

