package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateUserRequest;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        return createAccountWithRole(request, UserRole.USER);
    }

    @Transactional
    public UserResponse createAdmin(CreateUserRequest request) {
        return createAccountWithRole(request, UserRole.ADMIN);
    }

    private void validateRequest(CreateUserRequest request) {
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

    public List<UserResponse> getUserAll() {
        List<User> users = userRepository.findAll();
        return userMapper.toResponseList(users);
    }

    @Transactional(readOnly = true)
    public UserResponse getMyInfo(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toResponse(user);
    }

    private UserResponse createAccountWithRole(CreateUserRequest request, UserRole role) {
        validateRequest(request);

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
        user.setRole(role);
        user.setPremium(false);
        user.setStatus(UserStatus.ACTIVE);

        UserProfile profile = new UserProfile();
        profile.setUser(user);
        user.setProfile(profile);

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }


    @Transactional
    public UserResponse updateMyTargetScore(String email, Integer targetScore) {
        if (targetScore == null || targetScore < 10 || targetScore > 990) {
            throw new AppException(ErrorCode.INVALID_TARGET_SCORE);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.setTargetScore(targetScore);
        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

}
