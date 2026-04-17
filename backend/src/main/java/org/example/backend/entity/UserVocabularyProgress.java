package org.example.backend.entity;

import lombok.Getter;
import lombok.Setter;
import org.example.backend.enums.VocabularyStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_vocabulary_progress", uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_vocabulary", columnNames = {"user_id", "vocabulary_id"})
})
@Getter
@Setter
public class UserVocabularyProgress extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vocabulary_id", nullable = false)
    private Vocabulary vocabulary;

    @Column(name = "familiarity_level")
    private Integer familiarityLevel = 0;

    @Column(name = "ease_factor")
    private Double easeFactor = 2.5;

    @Column(name = "interval_days")
    private Integer intervalDays = 0;

    private Integer repetitions = 0;

    @Column(name = "last_reviewed_at")
    private LocalDateTime lastReviewedAt;

    @Column(name = "next_review_at")
    private LocalDateTime nextReviewAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private VocabularyStatus status = VocabularyStatus.LEARNING;
}
