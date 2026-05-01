package org.example.backend.dto.request;

import lombok.Data;

@Data
public class CreateFlashcardCollectionRequest {
    private String name;
    private String description;
}

