package org.example.backend.dto.request;

import lombok.Data;

@Data
public class UpdateGrammarRequest {
    private String title;
    private String content;
    private String tips;
    private String example;
    private Boolean active;
}
