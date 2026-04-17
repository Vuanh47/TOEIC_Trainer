package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
public class VocabularyTopicResponse {
    private Long id;
    private String name;
    private String description;
    private String level;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
