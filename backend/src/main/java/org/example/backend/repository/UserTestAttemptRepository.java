package org.example.backend.repository;

import org.example.backend.entity.UserTestAttempt;
import org.example.backend.entity.User;
import org.example.backend.entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserTestAttemptRepository extends JpaRepository<UserTestAttempt, Long> {
    List<UserTestAttempt> findByUserIdOrderByStartedAtDesc(Long userId);
    List<UserTestAttempt> findByTestIdOrderByStartedAtDesc(Long testId);
}

