package org.example.backend.dto.request;

import lombok.Data;

@Data
public class CreateUserRequest {
    private String email;
    private String password;
    private String fullName;
    private String avatarUrl;
    private String currentLevel;
    private Integer targetScore;
}

