package org.example.backend.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class SubmitPracticeAttemptRequest {
    private List<AnswerSubmission> answers;

    @Data
    public static class AnswerSubmission {
        private Long practiceSetQuestionId;
        private Long selectedOptionId;
    }
}

