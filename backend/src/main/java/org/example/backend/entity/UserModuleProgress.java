package org.example.backend.entity;

import lombok.Getter;
import lombok.Setter;
import org.example.backend.enums.ProgressStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_module_progress", uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_module_progress", columnNames = {"user_id", "module_id"})
})
@Getter
@Setter
public class UserModuleProgress extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = false)
    private LearningModule module;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ProgressStatus status = ProgressStatus.NOT_STARTED;

    @Column(name = "progress_percent")
    private Double progressPercent = 0.0;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "last_accessed_at")
    private LocalDateTime lastAccessedAt;

    private Double score;
}
