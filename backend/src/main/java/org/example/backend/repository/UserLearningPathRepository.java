package org.example.backend.repository;

import org.example.backend.enums.PathStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.UserLearningPath;

import java.util.List;

public interface UserLearningPathRepository extends JpaRepository<UserLearningPath, Long> {
	List<UserLearningPath> findByUserIdAndStatus(Long userId, PathStatus status);
}
