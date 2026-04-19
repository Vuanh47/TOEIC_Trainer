package org.example.backend.dto.request;

import lombok.Data;
import org.example.backend.enums.PracticeSetType;

@Data
public class CreatePracticeSetRequest {
    private Long moduleId;
    private String title;
    private String description;
    private Integer partNo;
    private Integer targetScore;
    private PracticeSetType setType;
    private Integer durationMinutes;
    private Boolean published;
}

