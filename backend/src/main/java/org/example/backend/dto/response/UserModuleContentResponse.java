package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import org.example.backend.enums.ModuleType;

import java.util.List;

@Getter
@Setter
public class UserModuleContentResponse {
    private Long moduleId;
    private String title;
    private String description;
    private ModuleType moduleType;
    private Integer estimatedMinutes;
    private String difficultyLevel;
    private List<UserLessonResponse> videoLessons;
    private List<FlashcardResponse> flashcards;
    private List<PracticeSetResponse> practiceSets;
}
