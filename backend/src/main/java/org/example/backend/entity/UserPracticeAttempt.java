package org.example.backend.entity;

import lombok.Getter;
import lombok.Setter;
import org.example.backend.enums.AttemptStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_practice_attempts")
@Getter
@Setter
public class UserPracticeAttempt extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "practice_set_id", nullable = false)
    private PracticeSet practiceSet;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    private Double score;

    @Column(name = "correct_count")
    private Integer correctCount = 0;

    @Column(name = "total_questions")
    private Integer totalQuestions = 0;

    @Column(name = "duration_seconds")
    private Integer durationSeconds = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AttemptStatus status = AttemptStatus.IN_PROGRESS;
}
