package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateAdminFlashcardRequest;
import org.example.backend.dto.request.UpdateAdminFlashcardRequest;
import org.example.backend.dto.response.ApiResponse;
import org.example.backend.dto.response.FlashcardResponse;
import org.example.backend.enums.SuccessCode;
import org.example.backend.service.FlashcardService;
import org.example.backend.util.ApiResponseUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/flashcards")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminFlashcardController {

    private final FlashcardService flashcardService;

    @PostMapping
    public ResponseEntity<ApiResponse<FlashcardResponse>> createFlashcardForLesson(
            @RequestBody CreateAdminFlashcardRequest request
    ) {
        FlashcardResponse response = flashcardService.createAdminFlashcard(request);
        return ApiResponseUtil.success(response, SuccessCode.FLASHCARD_CREATED);
    }

    @PutMapping("/{flashcardId}")
    public ResponseEntity<ApiResponse<FlashcardResponse>> updateFlashcard(
            @PathVariable Long flashcardId,
            @RequestBody UpdateAdminFlashcardRequest request
    ) {
        FlashcardResponse response = flashcardService.updateAdminFlashcard(flashcardId, request);
        return ApiResponseUtil.success(response, SuccessCode.FLASHCARD_UPDATED);
    }

    @DeleteMapping("/{flashcardId}")
    public ResponseEntity<ApiResponse<Void>> deleteFlashcard(@PathVariable Long flashcardId) {
        flashcardService.deleteAdminFlashcard(flashcardId);
        return ApiResponseUtil.success(SuccessCode.FLASHCARD_DELETED);
    }

    @GetMapping("/modules/{moduleId}")
    public ResponseEntity<ApiResponse<List<FlashcardResponse>>> getModuleFlashcardsForAdmin(
            @PathVariable Long moduleId,
            @RequestParam(required = false) String keyword
    ) {
        List<FlashcardResponse> response = keyword == null || keyword.isBlank()
                ? flashcardService.getModuleFlashcardsForAdmin(moduleId)
                : flashcardService.searchModuleFlashcardsForAdmin(moduleId, keyword);
        return ApiResponseUtil.success(response, SuccessCode.FLASHCARD_LISTED);
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<FlashcardResponse>>> searchFlashcards(@RequestParam String keyword) {
        List<FlashcardResponse> response = flashcardService.searchFlashcardsForAdmin(keyword);
        return ApiResponseUtil.success(response, SuccessCode.FLASHCARD_LISTED);
    }
}

