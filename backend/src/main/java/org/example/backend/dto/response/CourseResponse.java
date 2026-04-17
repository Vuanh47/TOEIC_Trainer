package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private Integer targetScore;
    private Boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
