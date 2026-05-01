package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
public class LearningPathMilestoneResponse {
    private Long id;
    private Long learningPathId;
    private String title;
    private String description;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
