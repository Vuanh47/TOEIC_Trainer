package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserGrammarResponse {
    private Long id;
    private String title;
    private String content;
    private String tips;
    private String example;
    private Boolean active;
    private Boolean isFavorite;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

