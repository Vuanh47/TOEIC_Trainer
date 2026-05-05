package org.example.backend.dto.request;

import lombok.Data;

@Data
public class UpdateTestPartRequest {
    private String partName;
    private String description;
    private Integer durationMinutes;
    private Integer sortOrder;
}

