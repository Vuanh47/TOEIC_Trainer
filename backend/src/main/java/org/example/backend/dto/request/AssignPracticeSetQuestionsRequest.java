package org.example.backend.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class AssignPracticeSetQuestionsRequest {
    private List<AssignPracticeSetQuestionItemRequest> questions;
}

