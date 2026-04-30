package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import org.example.backend.enums.ProgressStatus;
@Getter
@Setter
public class UserModuleProgressResponse {
    private Long id;
    private Long userId;
    private Long moduleId;
    private ProgressStatus status;
    private Double progressPercent;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime lastAccessedAt;
    private Double score;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
