package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.AskAIExplainRequest;
import org.example.backend.dto.request.SubmitTestAttemptRequest;
import org.example.backend.dto.response.AIExplainResponse;
import org.example.backend.dto.response.ApiResponse;
import org.example.backend.dto.response.TestAttemptResponse;
import org.example.backend.dto.response.TestResponse;
import org.example.backend.enums.SuccessCode;
import org.example.backend.service.GeminiAIService;
import org.example.backend.service.UserTestService;
import org.example.backend.util.ApiResponseUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users/tests")
@PreAuthorize("hasRole('USER')")
@RequiredArgsConstructor
public class UserTestController {

    private final UserTestService userTestService;
    private final GeminiAIService geminiAIService;

    @GetMapping("/published")
    public ResponseEntity<ApiResponse<List<TestResponse>>> getPublishedTests() {
        List<TestResponse> response = userTestService.getPublishedTests();
        return ApiResponseUtil.success(response, SuccessCode.TEST_LISTED);
    }

    @GetMapping("/{testId}")
    public ResponseEntity<ApiResponse<TestResponse>> getTestById(@PathVariable Long testId) {
        TestResponse response = userTestService.getTestById(testId);
        return ApiResponseUtil.success(response, SuccessCode.TEST_GET);
    }

    @PostMapping("/{testId}/start")
    public ResponseEntity<ApiResponse<TestAttemptResponse>> startTest(
            Authentication authentication,
            @PathVariable Long testId
    ) {
        TestAttemptResponse response = userTestService.startTest(authentication.getName(), testId);
        return ApiResponseUtil.success(response, SuccessCode.TEST_ATTEMPT_STARTED);
    }

    @PostMapping("/attempts/{attemptId}/submit")
    public ResponseEntity<ApiResponse<TestAttemptResponse>> submitAttempt(
            Authentication authentication,
            @PathVariable Long attemptId,
            @RequestBody SubmitTestAttemptRequest request
    ) {
        TestAttemptResponse response = userTestService.submitAttempt(authentication.getName(), attemptId, request);
        return ApiResponseUtil.success(response, SuccessCode.TEST_ATTEMPT_SUBMITTED);
    }

    @GetMapping("/attempts")
    public ResponseEntity<ApiResponse<List<TestAttemptResponse>>> getMyAttempts(Authentication authentication) {
        List<TestAttemptResponse> response = userTestService.getAttemptsForUser(authentication.getName());
        return ApiResponseUtil.success(response, SuccessCode.TEST_ATTEMPT_LISTED);
    }

    @GetMapping("/attempts/{attemptId}/details")
    public ResponseEntity<ApiResponse<TestAttemptResponse>> getAttemptDetails(
            Authentication authentication,
            @PathVariable Long attemptId
    ) {
        TestAttemptResponse response = userTestService.getAttemptDetails(authentication.getName(), attemptId);
        return ApiResponseUtil.success(response, SuccessCode.TEST_ATTEMPT_LISTED);
    }

    @PostMapping("/questions/explain")
    public ResponseEntity<ApiResponse<AIExplainResponse>> askAIExplain(@RequestBody AskAIExplainRequest request) {
        String type = request.getType() != null ? request.getType() : "BOTH";
        AIExplainResponse response = geminiAIService.explainQuestion(
                request.getTestPartQuestionId(),
                request.getSelectedAnswer(),
                type
        );
        return ApiResponseUtil.success(response, SuccessCode.TEST_QUESTION_EXPLAINED);
    }
}

