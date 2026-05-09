package org.example.backend.dto.request;

import lombok.Data;

@Data
public class AssignLearningPathRequest {
    private Long learningPathId;
    private Integer targetScore;
}
