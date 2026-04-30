package org.example.backend.entity;

import lombok.Getter;
import lombok.Setter;
import org.example.backend.enums.ProgressStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_video_progress", uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_lesson_progress", columnNames = {"user_id", "lesson_id"})
})
@Getter
@Setter
public class UserVideoProgress extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private VideoLesson lesson;

    @Column(name = "last_position_seconds", nullable = false)
    private Integer lastPositionSeconds = 0;

    @Column(name = "watched_seconds", nullable = false)
    private Integer watchedSeconds = 0;

    @Column(name = "completion_percent")
    private Double completionPercent = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ProgressStatus status = ProgressStatus.NOT_STARTED;

    @Column(name = "last_watched_at")
    private LocalDateTime lastWatchedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
