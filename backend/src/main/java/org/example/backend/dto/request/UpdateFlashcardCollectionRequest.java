package org.example.backend.dto.request;

import lombok.Data;

@Data
public class UpdateFlashcardCollectionRequest {
    private String name;
    private String description;
}

