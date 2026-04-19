package org.example.backend.dto.request;

import lombok.Data;

@Data
public class UpdateMilestoneModuleRequest {
    private Long moduleId;
    private Integer sortOrder;
    private Boolean required;
    private String unlockCondition;
}

