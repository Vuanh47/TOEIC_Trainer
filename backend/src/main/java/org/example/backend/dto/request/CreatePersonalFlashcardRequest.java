package org.example.backend.dto.request;

import lombok.Data;

@Data
public class CreatePersonalFlashcardRequest {
    private String englishWord;
    private String meaningVi;
    private String exampleSentence;
    private String pronunciation;
}

