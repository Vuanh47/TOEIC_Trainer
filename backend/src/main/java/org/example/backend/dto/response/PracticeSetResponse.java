package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import org.example.backend.enums.PracticeSetType;
import java.time.LocalDateTime;
@Getter
@Setter
public class PracticeSetResponse {
    private Long id;
    private String title;
    private String description;
    private Integer partNo;
    private Integer targetScore;
    private PracticeSetType setType;
    private Integer durationMinutes;
    private Boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
