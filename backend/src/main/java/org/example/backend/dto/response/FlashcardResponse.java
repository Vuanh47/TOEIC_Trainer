package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class FlashcardResponse {
    private Long id;
    private String englishWord;
    private String meaningVi;
    private String exampleSentence;
    private String pronunciation;
    private Long ownerId;
    private Long moduleId;
    private Boolean active;
    private Boolean personalCard;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

