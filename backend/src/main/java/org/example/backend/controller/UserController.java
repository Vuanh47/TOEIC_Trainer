package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateUserRequest;
import org.example.backend.dto.request.UpdateTargetScoreRequest;
import org.example.backend.dto.response.ApiResponse;
import org.example.backend.dto.response.UserResponse;
import org.example.backend.enums.SuccessCode;
import org.example.backend.service.UserService;
import org.example.backend.util.ApiResponseUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@RequestBody CreateUserRequest request) {
        return ApiResponseUtil.success(userService.createUser(request), SuccessCode.USER_CREATED);
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> createAdmin(@RequestBody CreateUserRequest request) {
        return ApiResponseUtil.success(userService.createAdmin(request), SuccessCode.ADMIN_CREATED);
    }
    
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getUserAll();
        return ApiResponseUtil.success(users, SuccessCode.USER_CREATED);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserResponse>> getMyInfo(Authentication authentication) {
        UserResponse response = userService.getMyInfo(authentication.getName());
        return ApiResponseUtil.success(response, SuccessCode.USER_INFO_RETRIEVED);
    }

        @PutMapping("/me/target-score")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<UserResponse>> updateMyTargetScore(
            Authentication authentication,
            @RequestBody UpdateTargetScoreRequest request
    ) {
        UserResponse response = userService.updateMyTargetScore(authentication.getName(), request.getTargetScore());
        return ApiResponseUtil.success(response, SuccessCode.TARGET_SCORE_UPDATED);
    }
}
