package org.example.backend.entity;

import lombok.Getter;
import lombok.Setter;
import org.example.backend.enums.ModuleType;
import jakarta.persistence.*;

@Entity
@Table(name = "learning_modules")
@Getter
@Setter
public class LearningModule extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "module_type", nullable = false, length = 30)
    private ModuleType moduleType;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "estimated_minutes")
    private Integer estimatedMinutes;

    @Column(name = "difficulty_level", length = 50)
    private String difficultyLevel;

    @Column(name = "is_active", nullable = false)
    private Boolean active = true;
}
