package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
@Getter
@Setter
public class UserProfileResponse {
    private Long id;
    private Long userId;
    private String phone;
    private LocalDate birthday;
    private String timezone;
    private String learningGoalText;
    private Integer dailyStudyGoalMinutes;
    private LocalTime preferredReminderTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
