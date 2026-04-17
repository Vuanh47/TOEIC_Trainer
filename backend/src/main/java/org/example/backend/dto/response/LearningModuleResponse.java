package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import org.example.backend.enums.ModuleType;
@Getter
@Setter
public class LearningModuleResponse {
    private Long id;
    private ModuleType moduleType;
    private String title;
    private String description;
    private String thumbnailUrl;
    private Integer estimatedMinutes;
    private String difficultyLevel;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
