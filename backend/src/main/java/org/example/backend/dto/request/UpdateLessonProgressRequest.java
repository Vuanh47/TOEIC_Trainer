package org.example.backend.dto.request;

import lombok.Data;

@Data
public class UpdateLessonProgressRequest {
    private Integer lastPositionSeconds;
    private Integer watchedSeconds;
    private Double completionPercent;
    private String status;
}

