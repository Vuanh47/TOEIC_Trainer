package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreatePersonalFlashcardRequest;
import org.example.backend.dto.request.UpdatePersonalFlashcardRequest;
import org.example.backend.dto.request.CreateFlashcardCollectionRequest;
import org.example.backend.dto.request.UpdateFlashcardCollectionRequest;
import org.example.backend.dto.response.FlashcardCollectionResponse;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
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

    @PutMapping("/{flashcardId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<FlashcardResponse>> updateMyFlashcard(
            Authentication authentication,
            @PathVariable Long flashcardId,
            @RequestBody UpdatePersonalFlashcardRequest request
    ) {
        FlashcardResponse response = flashcardService.updatePersonalFlashcard(authentication.getName(), flashcardId, request);
        return ApiResponseUtil.success(response, SuccessCode.FLASHCARD_UPDATED);
    }

    @DeleteMapping("/{flashcardId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Void>> deleteMyFlashcard(
            Authentication authentication,
            @PathVariable Long flashcardId
    ) {
        flashcardService.deletePersonalFlashcard(authentication.getName(), flashcardId);
        return ApiResponseUtil.success(SuccessCode.FLASHCARD_DELETED);
    }

    // Collection management endpoints
    @PostMapping("/collections")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<FlashcardCollectionResponse>> createCollection(
            Authentication authentication,
            @RequestBody CreateFlashcardCollectionRequest request
    ) {
        FlashcardCollectionResponse response = flashcardService.createCollection(authentication.getName(), request);
        return ApiResponseUtil.success(response, SuccessCode.FLASHCARD_COLLECTION_CREATED);
    }

    @GetMapping("/collections")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<FlashcardCollectionResponse>>> getMyCollections(Authentication authentication) {
        List<FlashcardCollectionResponse> response = flashcardService.getMyCollections(authentication.getName());
        return ApiResponseUtil.success(response, SuccessCode.FLASHCARD_COLLECTION_LISTED);
    }

    @GetMapping("/collections/{collectionId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<FlashcardCollectionResponse>> getCollectionDetail(
            Authentication authentication,
            @PathVariable Long collectionId
    ) {
        FlashcardCollectionResponse response = flashcardService.getCollectionDetail(authentication.getName(), collectionId);
        return ApiResponseUtil.success(response, SuccessCode.FLASHCARD_COLLECTION_LISTED);
    }

    @PutMapping("/collections/{collectionId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<FlashcardCollectionResponse>> updateCollection(
            Authentication authentication,
            @PathVariable Long collectionId,
            @RequestBody UpdateFlashcardCollectionRequest request
    ) {
        FlashcardCollectionResponse response = flashcardService.updateCollection(authentication.getName(), collectionId, request);
        return ApiResponseUtil.success(response, SuccessCode.FLASHCARD_COLLECTION_UPDATED);
    }

    @DeleteMapping("/collections/{collectionId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Void>> deleteCollection(
            Authentication authentication,
            @PathVariable Long collectionId
    ) {
        flashcardService.deleteCollection(authentication.getName(), collectionId);
        return ApiResponseUtil.success(SuccessCode.FLASHCARD_COLLECTION_DELETED);
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

