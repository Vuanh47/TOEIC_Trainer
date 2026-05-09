package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class FavoriteGrammarTitleResponse {
    private Long id;
    private String title;
    private LocalDateTime savedAt;
}

