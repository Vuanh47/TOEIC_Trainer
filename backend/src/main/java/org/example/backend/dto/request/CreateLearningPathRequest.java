package org.example.backend.dto.request;

import lombok.Data;

@Data
public class CreateLearningPathRequest {
    private String code;
    private String title;
    private String description;
    private Integer targetScore;
    private Boolean active;
}
