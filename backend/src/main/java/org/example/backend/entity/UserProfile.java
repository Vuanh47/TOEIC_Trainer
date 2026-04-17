package org.example.backend.entity;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
public class UserProfile extends BaseEntity {

    @Id
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 30)
    private String phone;

    private LocalDate birthday;

    @Column(length = 100)
    private String timezone = "Asia/Ho_Chi_Minh";

    @Column(name = "learning_goal_text", columnDefinition = "TEXT")
    private String learningGoalText;

    @Column(name = "daily_study_goal_minutes")
    private Integer dailyStudyGoalMinutes = 30;

    @Column(name = "preferred_reminder_time")
    private LocalTime preferredReminderTime;
}
