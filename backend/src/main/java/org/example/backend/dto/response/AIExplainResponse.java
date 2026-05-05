package org.example.backend.dto.response;

import lombok.Data;

@Data
public class AIExplainResponse {
    private String explanation;
    private String tips;
    private String correctAnswer;
    private String userAnswer;
}

