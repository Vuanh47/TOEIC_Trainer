package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import org.example.backend.enums.ProgressStatus;
@Getter
@Setter
public class UserVideoProgressResponse {
    private Long id;
    private Long userId;
    private Long lessonId;
    private Integer lastPositionSeconds;
    private Integer watchedSeconds;
    private Double completionPercent;
    private ProgressStatus status;
    private LocalDateTime lastWatchedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
