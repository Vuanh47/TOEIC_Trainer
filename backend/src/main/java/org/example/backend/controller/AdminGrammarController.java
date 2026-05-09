package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateGrammarRequest;
import org.example.backend.dto.request.UpdateGrammarRequest;
import org.example.backend.dto.response.ApiResponse;
import org.example.backend.dto.response.GrammarResponse;
import org.example.backend.enums.SuccessCode;
import org.example.backend.service.AdminGrammarService;
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
@RequestMapping("/admin/grammars")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminGrammarController {

    private final AdminGrammarService adminGrammarService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GrammarResponse>>> getAllGrammars() {
        List<GrammarResponse> response = adminGrammarService.getAllGrammars();
        return ApiResponseUtil.success(response, SuccessCode.GRAMMAR_LISTED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GrammarResponse>> getGrammarById(@PathVariable Long id) {
        GrammarResponse response = adminGrammarService.getGrammarById(id);
        return ApiResponseUtil.success(response, SuccessCode.GRAMMAR_GET);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GrammarResponse>> createGrammar(@RequestBody CreateGrammarRequest request) {
        GrammarResponse response = adminGrammarService.createGrammar(request);
        return ApiResponseUtil.success(response, SuccessCode.GRAMMAR_CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GrammarResponse>> updateGrammar(
            @PathVariable Long id,
            @RequestBody UpdateGrammarRequest request
    ) {
        GrammarResponse response = adminGrammarService.updateGrammar(id, request);
        return ApiResponseUtil.success(response, SuccessCode.GRAMMAR_UPDATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGrammar(@PathVariable Long id) {
        adminGrammarService.deleteGrammar(id);
        return ApiResponseUtil.success(SuccessCode.GRAMMAR_DELETED);
    }
}
