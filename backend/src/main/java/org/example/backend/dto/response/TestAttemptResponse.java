package org.example.backend.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TestAttemptResponse {
    private Long attemptId;
    private Long testId;
    private String testTitle;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private Double score;
    private Integer correctCount;
    private Integer totalQuestions;
    private List<QuestionAnswerResult> answers;

    @Data
    public static class QuestionAnswerResult {
        private Long testPartQuestionId;
        private Integer partNo;
        private String questionText;
        private String explanation;
        private String difficultyLevel;
        private String sourceType;
        private Integer sourceYear;
        private String selectedLabel;
        private String correctLabel;
        private Boolean correct;
        private List<OptionInfo> options;
    }

    @Data
    public static class OptionInfo {
        private String optionLabel;
        private String optionText;
        private Boolean correct;
    }
}



