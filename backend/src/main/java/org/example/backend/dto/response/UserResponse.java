package org.example.backend.dto.response;

import lombok.Data;
import java.time.LocalDateTime;
import org.example.backend.enums.AuthProvider;
import org.example.backend.enums.UserRole;
import org.example.backend.enums.UserStatus;
@Data
public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String avatarUrl;
    private AuthProvider authProvider;
    private String providerUserId;
    private String currentLevel;
    private Integer targetScore;
    private Boolean premium;
    private UserRole role;
    private UserStatus status;
    private Long profileId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
