package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import org.example.backend.enums.ModuleType;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class UserRoadmapResponse {
    private Long assignmentId;
    private Long learningPathId;
    private String learningPathCode;
    private String learningPathTitle;
    private String learningPathDescription;
    private Integer targetScore;
    private String status;
    private Double progressPercent;
    private Long currentModuleId;
    private LocalDateTime assignedAt;
    private List<MilestoneItem> milestones;

    @Getter
    @Setter
    public static class MilestoneItem {
        private Long id;
        private String title;
        private String description;
        private Integer sortOrder;
        private List<ModuleItem> modules;
    }

    @Getter
    @Setter
    public static class ModuleItem {
        private Long moduleId;
        private String title;
        private String description;
        private ModuleType moduleType;
        private Integer estimatedMinutes;
        private String difficultyLevel;
        private Integer sortOrder;
        private Boolean required;
        private String unlockCondition;
        private String progressStatus;
        private Double progressPercent;
        private Long videoLessonCount;
        private Long flashcardCount;
        private Long practiceSetCount;
    }
}
