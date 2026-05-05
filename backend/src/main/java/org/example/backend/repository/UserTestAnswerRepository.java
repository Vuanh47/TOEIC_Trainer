package org.example.backend.repository;

import org.example.backend.entity.UserTestAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserTestAnswerRepository extends JpaRepository<UserTestAnswer, Long> {
    List<UserTestAnswer> findByAttemptIdOrderByIdAsc(Long attemptId);
}

