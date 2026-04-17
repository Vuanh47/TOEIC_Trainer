package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreatePersonalFlashcardRequest;
import org.example.backend.dto.response.ApiResponse;
import org.example.backend.dto.response.FlashcardResponse;
import org.example.backend.enums.SuccessCode;
import org.example.backend.service.FlashcardService;
import org.example.backend.util.ApiResponseUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users/flashcards")
@RequiredArgsConstructor
public class UserFlashcardController {

    private final FlashcardService flashcardService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<FlashcardResponse>> createMyFlashcard(
            Authentication authentication,
            @RequestBody CreatePersonalFlashcardRequest request
    ) {
        FlashcardResponse response = flashcardService.createPersonalFlashcard(authentication.getName(), request);
        return ApiResponseUtil.success(response, SuccessCode.FLASHCARD_CREATED);
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<FlashcardResponse>>> getMyFlashcards(Authentication authentication) {
        List<FlashcardResponse> response = flashcardService.getMyFlashcards(authentication.getName());
        return ApiResponseUtil.success(response, SuccessCode.FLASHCARD_LISTED);
    }

    @GetMapping("/modules/{moduleId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<FlashcardResponse>>> getModuleFlashcardsForUser(
            @PathVariable Long moduleId,
            @RequestParam(required = false) String keyword
    ) {
        List<FlashcardResponse> response = keyword == null || keyword.isBlank()
                ? flashcardService.getModuleFlashcardsForUser(moduleId)
                : flashcardService.searchModuleFlashcardsForUser(moduleId, keyword);
        return ApiResponseUtil.success(response, SuccessCode.FLASHCARD_LISTED);
    }
}

