package org.example.backend.dto.request;

import lombok.Data;

@Data
public class UploadAndCreateVideoLessonRequest {
    private Long moduleId;
    private String title;
    private String description;
    private Integer sortOrder;
    private Boolean free;
    private Boolean published;
}

