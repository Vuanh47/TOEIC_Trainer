package org.example.backend.dto.response;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TestPartResponse {
    private Long id;
    private String partName;
    private Integer partNumber;
    private String partSection;
    private String description;
    private Integer sortOrder;
    private Integer durationMinutes;
    private Integer questionCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TestPartQuestionResponse> questions;
}

