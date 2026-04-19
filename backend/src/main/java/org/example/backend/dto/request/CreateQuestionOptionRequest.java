package org.example.backend.dto.request;

import lombok.Data;

@Data
public class CreateQuestionOptionRequest {
    private String optionLabel;
    private String optionText;
    private Boolean correct;
}

