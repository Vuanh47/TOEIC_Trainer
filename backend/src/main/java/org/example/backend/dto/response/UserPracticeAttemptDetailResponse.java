package org.example.backend.dto.response;

import lombok.Data;
import org.example.backend.enums.AttemptStatus;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserPracticeAttemptDetailResponse {
    private Long attemptId;
    private Long practiceSetId;
    private String practiceSetTitle;
    private Long moduleId;
    private String moduleTitle;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private Double score;
    private Integer correctCount;
    private Integer totalQuestions;
    private Integer durationSeconds;
    private AttemptStatus status;
    private List<QuestionReviewItem> answers;

    @Data
    public static class QuestionReviewItem {
        private Long practiceSetQuestionId;
        private Long questionId;
        private Integer sortOrder;
        private Integer partNo;
        private String questionText;
        private String explanation;
        private String difficultyLevel;
        private String sourceType;
        private Integer sourceYear;
        private Long selectedOptionId;
        private String selectedLabel;
        private String selectedText;
        private Long correctOptionId;
        private String correctLabel;
        private String correctText;
        private Boolean correct;
        private List<OptionItem> options;
    }

    @Data
    public static class OptionItem {
        private Long id;
        private String optionLabel;
        private String optionText;
        private Boolean correct;
    }
}

