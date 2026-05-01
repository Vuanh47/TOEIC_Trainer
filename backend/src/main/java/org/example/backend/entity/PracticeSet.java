package org.example.backend.entity;

import lombok.Getter;
import lombok.Setter;
import org.example.backend.enums.PracticeSetType;
import jakarta.persistence.*;

@Entity
@Table(name = "practice_sets")
@Getter
@Setter
public class PracticeSet extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id")
    private LearningModule module;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "part_no")
    private Integer partNo;

    @Column(name = "target_score")
    private Integer targetScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "set_type", nullable = false, length = 30)
    private PracticeSetType setType = PracticeSetType.PRACTICE;

    @Column(name = "duration_minutes")
    private Integer durationMinutes = 20;

    @Column(name = "is_published", nullable = false)
    private Boolean published = false;
}
