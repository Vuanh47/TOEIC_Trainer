package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
public class VocabularyResponse {
    private Long id;
    private String word;
    private String ipa;
    private String audioUrl;
    private String meaningVi;
    private String meaningEn;
    private String exampleSentence;
    private String exampleTranslation;
    private String imageUrl;
    private String partOfSpeech;
    private String difficultyLevel;
    private Long topicId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
