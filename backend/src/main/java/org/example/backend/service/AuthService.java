package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.LoginRequest;
import org.example.backend.dto.request.RegisterRequest;
import org.example.backend.dto.response.AuthResponse;
import org.example.backend.dto.response.UserResponse;
import org.example.backend.entity.User;
import org.example.backend.entity.UserProfile;
import org.example.backend.enums.AuthProvider;
import org.example.backend.enums.ErrorCode;
import org.example.backend.enums.UserRole;
import org.example.backend.enums.UserStatus;
import org.example.backend.exception.AppException;
import org.example.backend.mapper.UserMapper;
import org.example.backend.repository.UserRepository;
import org.example.backend.security.JwtService;
import org.example.backend.security.TokenBlacklistService;
import org.example.backend.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final TokenBlacklistService tokenBlacklistService;
    private final UserMapper userMapper;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        validateRegisterRequest(request);

        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword().trim()));
        user.setFullName(trimToNull(request.getFullName()));
        user.setAvatarUrl(trimToNull(request.getAvatarUrl()));
        user.setCurrentLevel(trimToNull(request.getCurrentLevel()));
        user.setTargetScore(request.getTargetScore());
        user.setAuthProvider(AuthProvider.EMAIL);
        user.setRole(UserRole.USER);
        user.setPremium(false);
        user.setStatus(UserStatus.ACTIVE);

        UserProfile profile = new UserProfile();
        profile.setUser(user);
        user.setProfile(profile);

        User savedUser = userRepository.save(user);
        return buildAuthResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        if (request == null
                || request.getEmail() == null || request.getEmail().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {
            throw new AppException(ErrorCode.INVALID_ACCOUNT_DATA);
        }

        String email = request.getEmail().trim().toLowerCase();
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new AppException(ErrorCode.LOGIN_FAIL);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return buildAuthResponse(user);
    }

    public void logout(String authorizationHeader) {
        String token = extractBearerToken(authorizationHeader);

        String username = jwtService.extractUsername(token);
        if (username == null || !jwtService.isTokenValid(token, username)) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }

        tokenBlacklistService.revokeToken(token);
    }

    private AuthResponse buildAuthResponse(User user) {
        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtService.generateToken(principal);
        UserResponse userResponse = userMapper.toResponse(user);

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(jwtService.getJwtExpirationMs())
                .user(userResponse)
                .build();
    }

    private void validateRegisterRequest(RegisterRequest request) {
        if (request == null
                || request.getEmail() == null || request.getEmail().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {
            throw new AppException(ErrorCode.INVALID_ACCOUNT_DATA);
        }
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }

        String value = authorizationHeader.trim();
        if (value.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }

        while (value.regionMatches(true, 0, "Bearer ", 0, 7)) {
            value = value.substring(7).trim();
        }

        if (value.length() >= 2 && value.startsWith("\"") && value.endsWith("\"")) {
            value = value.substring(1, value.length() - 1).trim();
        }

        String token = value;
        if (token.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
        return token;
    }
}

