package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserLessonResponse {
    private Long lessonId;
    private Long moduleId;
    private String moduleTitle;
    private String lessonTitle;
    private String lessonDescription;
    private String videoUrl;
    private Integer durationSeconds;
    private Integer sortOrder;
    private Boolean free;
    private Double completionPercent;
    private Integer lastPositionSeconds;
    private String progressStatus;
}
