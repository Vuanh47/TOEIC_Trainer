package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class FlashcardCollectionResponse {
    private Long id;
    private String name;
    private String description;
    private Integer sortOrder;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer flashcardCount;
    private List<FlashcardResponse> flashcards;
}

