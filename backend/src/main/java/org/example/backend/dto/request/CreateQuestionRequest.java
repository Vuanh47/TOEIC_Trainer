package org.example.backend.dto.request;

import lombok.Data;
import org.example.backend.enums.QuestionSourceType;

import java.util.List;

@Data
public class CreateQuestionRequest {
    private Integer partNo;
    private String questionText;
    private String explanation;
    private String difficultyLevel;
    private QuestionSourceType sourceType;
    private Integer sourceYear;
    private List<CreateQuestionOptionRequest> options;
}

