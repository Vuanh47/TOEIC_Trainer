package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
public class VideoNoteResponse {
    private Long id;
    private Long userId;
    private Long lessonId;
    private Integer timestampSeconds;
    private String noteText;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
