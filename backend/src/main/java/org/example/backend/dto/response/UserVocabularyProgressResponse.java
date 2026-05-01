package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import org.example.backend.enums.VocabularyStatus;
@Getter
@Setter
public class UserVocabularyProgressResponse {
    private Long id;
    private Long userId;
    private Long vocabularyId;
    private Integer familiarityLevel;
    private Double easeFactor;
    private Integer intervalDays;
    private Integer repetitions;
    private LocalDateTime lastReviewedAt;
    private LocalDateTime nextReviewAt;
    private VocabularyStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
