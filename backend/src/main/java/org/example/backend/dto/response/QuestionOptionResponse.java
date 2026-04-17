package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
public class QuestionOptionResponse {
    private Long id;
    private Long questionId;
    private String optionLabel;
    private String optionText;
    private Boolean correct;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
