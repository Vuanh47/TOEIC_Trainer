package org.example.backend.entity;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_practice_answers")
@Getter
@Setter
public class UserPracticeAnswer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private UserPracticeAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_option_id")
    private QuestionOption selectedOption;

    @Column(name = "is_correct")
    private Boolean correct;

    @Column(name = "answered_at")
    private LocalDateTime answeredAt;

    @Column(name = "ai_explanation_requested", nullable = false)
    private Boolean aiExplanationRequested = false;
}
