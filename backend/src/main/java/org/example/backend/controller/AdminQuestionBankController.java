package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateQuestionRequest;
import org.example.backend.dto.request.UpdateQuestionRequest;
import org.example.backend.dto.response.ApiResponse;
import org.example.backend.dto.response.QuestionResponse;
import org.example.backend.enums.SuccessCode;
import org.example.backend.service.AdminQuestionBankService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/questions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminQuestionBankController {

    private final AdminQuestionBankService adminQuestionBankService;

    @PostMapping
    public ResponseEntity<ApiResponse<QuestionResponse>> createQuestion(@RequestBody CreateQuestionRequest request) {
        QuestionResponse response = adminQuestionBankService.createQuestion(request);
        return ApiResponseUtil.success(response, SuccessCode.QUESTION_CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<QuestionResponse>>> getQuestions(
            @RequestParam(value = "keyword", required = false) String keyword
    ) {
        List<QuestionResponse> response = adminQuestionBankService.getQuestions(keyword);
        return ApiResponseUtil.success(response, SuccessCode.QUESTION_LISTED);
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<ApiResponse<QuestionResponse>> getQuestionById(@PathVariable Long questionId) {
        QuestionResponse response = adminQuestionBankService.getQuestionById(questionId);
        return ApiResponseUtil.success(response, SuccessCode.QUESTION_GET);
    }

    @PutMapping("/{questionId}")
    public ResponseEntity<ApiResponse<QuestionResponse>> updateQuestion(
            @PathVariable Long questionId,
            @RequestBody UpdateQuestionRequest request
    ) {
        QuestionResponse response = adminQuestionBankService.updateQuestion(questionId, request);
        return ApiResponseUtil.success(response, SuccessCode.QUESTION_UPDATED);
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(@PathVariable Long questionId) {
        adminQuestionBankService.deleteQuestion(questionId);
        return ApiResponseUtil.success(SuccessCode.QUESTION_DELETED);
    }
}

