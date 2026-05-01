package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModuleUnlockResponse {
    private Long moduleId;
    private String moduleStatus;
    private Double moduleProgressPercent;
    private Boolean moduleCompleted;
    private Long nextModuleId;
    private Boolean nextModuleUnlocked;
    private Boolean pathCompleted;
}

