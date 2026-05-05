package org.example.backend.entity;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;

@Entity
@Table(name = "user_test_answers")
@Getter
@Setter
public class UserTestAnswer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private UserTestAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_part_question_id", nullable = false)
    private TestPartQuestion testPartQuestion;

    // label selected by user, e.g. "A", "B"
    @Column(name = "selected_label", length = 5)
    private String selectedLabel;

    @Column(name = "correct")
    private Boolean correct = false;
}

