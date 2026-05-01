package org.example.backend.entity;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "learning_path_milestones")
@Getter
@Setter
public class LearningPathMilestone extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learning_path_id", nullable = false)
    private LearningPath learningPath;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    @OneToMany(mappedBy = "milestone", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<MilestoneModule> modules = new ArrayList<>();
}
