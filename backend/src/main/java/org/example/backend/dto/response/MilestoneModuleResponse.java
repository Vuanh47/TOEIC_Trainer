package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
public class MilestoneModuleResponse {
    private Long id;
    private Long milestoneId;
    private Long moduleId;
    private Integer sortOrder;
    private Boolean required;
    private String unlockCondition;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
