package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.response.ApiResponse;
import org.example.backend.dto.response.FavoriteGrammarTitleResponse;
import org.example.backend.dto.response.UserGrammarResponse;
import org.example.backend.enums.SuccessCode;
import org.example.backend.service.UserGrammarService;
import org.example.backend.util.ApiResponseUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users/grammars")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserGrammarController {

    private final UserGrammarService userGrammarService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserGrammarResponse>>> getActiveGrammars(Authentication authentication) {
        List<UserGrammarResponse> response = userGrammarService.getActiveGrammars(authentication.getName());
        return ApiResponseUtil.success(response, SuccessCode.GRAMMAR_LISTED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserGrammarResponse>> getGrammarById(
            Authentication authentication,
            @PathVariable Long id
    ) {
        UserGrammarResponse response = userGrammarService.getGrammarById(authentication.getName(), id);
        return ApiResponseUtil.success(response, SuccessCode.GRAMMAR_GET);
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<ApiResponse<Void>> addFavorite(
            Authentication authentication,
            @PathVariable Long id
    ) {
        userGrammarService.addFavorite(authentication.getName(), id);
        return ApiResponseUtil.success(SuccessCode.GRAMMAR_FAVORITED);
    }

    @DeleteMapping("/{id}/favorite")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            Authentication authentication,
            @PathVariable Long id
    ) {
        userGrammarService.removeFavorite(authentication.getName(), id);
        return ApiResponseUtil.success(SuccessCode.GRAMMAR_UNFAVORITED);
    }

    @GetMapping("/favorites/list")
    public ResponseEntity<ApiResponse<List<UserGrammarResponse>>> getFavoriteGrammars(Authentication authentication) {
        List<UserGrammarResponse> response = userGrammarService.getFavoriteGrammars(authentication.getName());
        return ApiResponseUtil.success(response, SuccessCode.GRAMMAR_FAVORITE_LISTED);
    }

    @GetMapping("/favorites/titles")
    public ResponseEntity<ApiResponse<List<FavoriteGrammarTitleResponse>>> getFavoriteTitles(Authentication authentication) {
        List<FavoriteGrammarTitleResponse> response = userGrammarService.getFavoriteTitles(authentication.getName());
        return ApiResponseUtil.success(response, SuccessCode.GRAMMAR_FAVORITE_TITLE_LISTED);
    }
}

