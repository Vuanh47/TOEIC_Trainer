package org.example.backend.entity;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "learning_paths")
@Getter
@Setter
public class LearningPath extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "target_score", nullable = false)
    private Integer targetScore;

    @Column(name = "is_active", nullable = false)
    private Boolean active = true;

    @OneToMany(mappedBy = "learningPath", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<LearningPathMilestone> milestones = new ArrayList<>();
}
