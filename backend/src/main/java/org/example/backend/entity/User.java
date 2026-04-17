package org.example.backend.entity;

import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.example.backend.enums.AuthProvider;
import org.example.backend.enums.UserRole;
import org.example.backend.enums.UserStatus;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor

@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "full_name", length = 255)
    private String fullName;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider", nullable = false, length = 30)
    private AuthProvider authProvider = AuthProvider.EMAIL;

    @Column(name = "provider_user_id", length = 255)
    private String providerUserId;

    @Column(name = "current_level", length = 50)
    private String currentLevel;

    @Column(name = "target_score")
    private Integer targetScore;

    @Column(name = "is_premium", nullable = false)
    private Boolean premium = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private UserRole role = UserRole.USER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private UserStatus status = UserStatus.ACTIVE;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private UserProfile profile;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserLearningPath> learningPaths = new ArrayList<>();
}
