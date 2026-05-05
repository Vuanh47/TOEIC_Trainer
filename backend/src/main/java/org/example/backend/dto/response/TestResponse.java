package org.example.backend.dto.response;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TestResponse {
    private Long id;
    private String title;
    private String description;
    private String testType;
    private Integer totalDurationMinutes;
    private Integer targetScore;
    private Boolean published;
    private Integer partCount;
    private Integer questionCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TestPartResponse> parts;
}

