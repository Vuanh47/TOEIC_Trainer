package org.example.backend.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class SubmitTestAttemptRequest {
    private List<AnswerSubmission> answers;

    @Data
    public static class AnswerSubmission {
        private Long testPartQuestionId;
        private String selectedLabel;
    }
}

