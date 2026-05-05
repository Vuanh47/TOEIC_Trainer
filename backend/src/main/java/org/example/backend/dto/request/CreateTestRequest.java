package org.example.backend.dto.request;

import lombok.Data;

@Data
public class CreateTestRequest {
    private String title;
    private String description;
    private String testType; // FULL_TEST, READING_ONLY, LISTENING_ONLY, PRACTICE
    private Integer totalDurationMinutes;
    private Integer targetScore;
    private Boolean published;
}

