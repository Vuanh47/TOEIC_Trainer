package org.example.backend.dto.request;

import lombok.Data;

@Data
public class CreateVideoLessonRequest {
    private Long courseId;
    private Long moduleId;
    private String title;
    private String description;
    private String videoUrl;
    private Integer durationSeconds;
    private Integer sortOrder;
    private Boolean free;
    private Boolean published;
}

