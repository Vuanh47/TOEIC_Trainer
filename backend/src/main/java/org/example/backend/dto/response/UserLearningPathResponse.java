package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import org.example.backend.enums.PathStatus;
@Getter
@Setter
public class UserLearningPathResponse {
    private Long id;
    private Long userId;
    private Long learningPathId;
    private String source;
    private PathStatus status;
    private LocalDateTime assignedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
