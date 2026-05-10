package org.example.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class UserStreakResponse {
    private String email;
    private String timezone;
    private Integer currentLoginStreak;
    private Integer longestLoginStreak;
    private LocalDate lastLoginDate;
    private LocalDateTime lastLoginAt;
    private Boolean todayLoggedIn;
}
