package org.example.backend.dto.request;

import lombok.Data;

@Data
public class CreateTestPartRequest {
    private String partName; // "Reading Part 1"
    private Integer partNumber; // 1, 2, 3, 4
    private String partSection; // READING, LISTENING
    private String description;
    private Integer sortOrder;
    private Integer durationMinutes;
}

