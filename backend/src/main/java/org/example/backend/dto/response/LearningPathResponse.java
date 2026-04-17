package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
public class LearningPathResponse {
    private Long id;
    private String code;
    private String title;
    private String description;
    private Integer targetScore;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
