package org.example.backend.dto.request;

import lombok.Data;

@Data
public class UpdateTestRequest {
    private String title;
    private String description;
    private String testType;
    private Integer totalDurationMinutes;
    private Integer targetScore;
    private Boolean published;
}

