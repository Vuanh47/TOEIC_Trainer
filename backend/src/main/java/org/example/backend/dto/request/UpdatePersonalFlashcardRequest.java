package org.example.backend.dto.request;

import lombok.Data;

@Data
public class UpdatePersonalFlashcardRequest {
    private String englishWord;
    private String meaningVi;
    private String exampleSentence;
    private String pronunciation;
    private Long flashcardCollectionId;
}

