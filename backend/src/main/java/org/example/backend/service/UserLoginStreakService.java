package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.response.UserStreakResponse;
import org.example.backend.entity.User;
import org.example.backend.entity.UserProfile;
import org.example.backend.enums.ErrorCode;
import org.example.backend.exception.AppException;
import org.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class UserLoginStreakService {

    private static final String DEFAULT_TIMEZONE = "Asia/Ho_Chi_Minh";

    private final UserRepository userRepository;

    @Transactional
    public UserStreakResponse recordLogin(String email) {
        User user = userRepository.findByEmailForUpdate(normalizeEmail(email))
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        ZoneId zoneId = resolveZoneId(user);
        LocalDate today = LocalDate.now(zoneId);
        LocalDate yesterday = today.minusDays(1);

        Integer currentStreak = safeInteger(user.getCurrentLoginStreak());
        Integer longestStreak = safeInteger(user.getLongestLoginStreak());
        LocalDate lastLoginDate = user.getLastLoginDate();

        if (lastLoginDate == null) {
            currentStreak = 1;
        } else if (today.equals(lastLoginDate)) {
            currentStreak = Math.max(currentStreak, 1);
        } else if (yesterday.equals(lastLoginDate)) {
            currentStreak = Math.max(currentStreak, 0) + 1;
        } else {
            currentStreak = 1;
        }

        longestStreak = Math.max(longestStreak, currentStreak);

        user.setLastLoginDate(today);
        user.setLastLoginAt(LocalDateTime.now(zoneId));
        user.setCurrentLoginStreak(currentStreak);
        user.setLongestLoginStreak(longestStreak);

        User savedUser = userRepository.save(user);
        return toResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public UserStreakResponse getMyStreak(String email) {
        User user = userRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return toResponse(user);
    }

    private UserStreakResponse toResponse(User user) {
        ZoneId zoneId = resolveZoneId(user);
        LocalDate today = LocalDate.now(zoneId);
        LocalDate lastLoginDate = user.getLastLoginDate();

        return UserStreakResponse.builder()
                .email(user.getEmail())
                .timezone(zoneId.getId())
                .currentLoginStreak(safeInteger(user.getCurrentLoginStreak()))
                .longestLoginStreak(safeInteger(user.getLongestLoginStreak()))
                .lastLoginDate(lastLoginDate)
                .lastLoginAt(user.getLastLoginAt())
                .todayLoggedIn(lastLoginDate != null && lastLoginDate.equals(today))
                .build();
    }

    private ZoneId resolveZoneId(User user) {
        String timezone = DEFAULT_TIMEZONE;
        UserProfile profile = user.getProfile();
        if (profile != null && profile.getTimezone() != null && !profile.getTimezone().isBlank()) {
            timezone = profile.getTimezone().trim();
        }

        try {
            return ZoneId.of(timezone);
        } catch (Exception ex) {
            return ZoneId.of(DEFAULT_TIMEZONE);
        }
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private int safeInteger(Integer value) {
        return value == null ? 0 : value;
    }
}
