package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PracticeSetQuestionDetailResponse {
    private Long id;
    private Long practiceSetId;
    private Long questionId;
    private Integer sortOrder;
    private QuestionResponse question;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

