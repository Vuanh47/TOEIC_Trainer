package org.example.backend.dto.request;

import lombok.Data;

@Data
public class UpdateLearningPathMilestoneRequest {
    private String title;
    private String description;
    private Integer sortOrder;
}

