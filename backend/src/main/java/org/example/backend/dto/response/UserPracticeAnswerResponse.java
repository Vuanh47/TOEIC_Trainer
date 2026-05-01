package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
public class UserPracticeAnswerResponse {
    private Long id;
    private Long attemptId;
    private Long questionId;
    private Long selectedOptionId;
    private Boolean correct;
    private LocalDateTime answeredAt;
    private Boolean aiExplanationRequested;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
