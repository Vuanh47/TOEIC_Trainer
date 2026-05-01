package org.example.backend.dto.request;

import lombok.Data;

@Data
public class CreateAdminFlashcardRequest {
    private Long moduleId;
    private String englishWord;
    private String meaningVi;
    private String exampleSentence;
    private String pronunciation;
    private Boolean active;
}

