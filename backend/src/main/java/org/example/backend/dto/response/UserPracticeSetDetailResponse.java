package org.example.backend.dto.response;

import lombok.Data;
import org.example.backend.enums.PracticeSetType;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserPracticeSetDetailResponse {
    private Long id;
    private Long moduleId;
    private String moduleTitle;
    private String title;
    private String description;
    private Integer partNo;
    private Integer targetScore;
    private PracticeSetType setType;
    private Integer durationMinutes;
    private Boolean published;
    private Integer questionCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<QuestionItem> questions;

    @Data
    public static class QuestionItem {
        private Long practiceSetQuestionId;
        private Long questionId;
        private Integer sortOrder;
        private Integer partNo;
        private String questionText;
        private String difficultyLevel;
        private String sourceType;
        private Integer sourceYear;
        private List<OptionItem> options;
    }

    @Data
    public static class OptionItem {
        private Long id;
        private String optionLabel;
        private String optionText;
    }
}

