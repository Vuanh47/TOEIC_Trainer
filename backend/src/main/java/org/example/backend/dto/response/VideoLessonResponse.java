package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
public class VideoLessonResponse {
    private Long id;
    private Long courseId;
    private Long moduleId;
    private String title;
    private String description;
    private String videoUrl;
    private Integer durationSeconds;
    private Integer sortOrder;
    private Boolean free;
    private Boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
