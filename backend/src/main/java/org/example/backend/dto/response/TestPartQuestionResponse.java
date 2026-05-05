package org.example.backend.dto.response;

import lombok.Data;

@Data
public class TestPartQuestionResponse {
    private Long id;
    private Long questionId;
    private Integer sortOrder;
    private String questionText;
    private Integer partNo;
    private String difficultyLevel;
    private java.util.List<QuestionOptionResponse> options;
}

