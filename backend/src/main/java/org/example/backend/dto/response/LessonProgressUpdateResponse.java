package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LessonProgressUpdateResponse {
    private Long lessonId;
    private Long moduleId;
    private String lessonStatus;
    private Double lessonCompletionPercent;
    private Integer lastPositionSeconds;
    private Integer watchedSeconds;
    private String moduleStatus;
    private Double moduleProgressPercent;
    private Long nextModuleId;
    private Boolean nextModuleUnlocked;
    private Boolean pathCompleted;
}

