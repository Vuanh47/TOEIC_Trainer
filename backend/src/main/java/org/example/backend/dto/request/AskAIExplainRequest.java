package org.example.backend.dto.request;

import lombok.Data;

@Data
public class AskAIExplainRequest {
    private Long testPartQuestionId;
    private String selectedAnswer; // optional: answer chosen by user
    private String type; // "EXPLANATION" or "TIPS" or "BOTH"
}

