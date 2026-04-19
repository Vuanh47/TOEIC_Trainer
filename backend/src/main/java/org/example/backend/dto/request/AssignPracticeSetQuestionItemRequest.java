package org.example.backend.dto.request;

import lombok.Data;

@Data
public class AssignPracticeSetQuestionItemRequest {
    private Long questionId;
    private Integer sortOrder;
}

