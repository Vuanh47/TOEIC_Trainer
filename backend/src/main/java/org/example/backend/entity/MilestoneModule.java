package org.example.backend.entity;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;

@Entity
@Table(name = "milestone_modules")
@Getter
@Setter
public class MilestoneModule extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "milestone_id", nullable = false)
    private LearningPathMilestone milestone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = false)
    private LearningModule module;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    @Column(name = "is_required", nullable = false)
    private Boolean required = true;

    @Column(name = "unlock_condition", columnDefinition = "TEXT")
    private String unlockCondition;
}
