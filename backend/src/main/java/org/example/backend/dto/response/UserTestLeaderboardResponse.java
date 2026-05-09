package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserTestLeaderboardResponse {
    private Integer position;
    private Long userId;
    private String fullName;
    private String avatarUrl;
    private Double totalScore;
    private Long totalAttempts;

    public UserTestLeaderboardResponse() {
    }

    public UserTestLeaderboardResponse(Long userId, String fullName, String avatarUrl, Double totalScore, Long totalAttempts) {
        this.position = null;
        this.userId = userId;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.totalScore = totalScore;
        this.totalAttempts = totalAttempts;
    }
}


