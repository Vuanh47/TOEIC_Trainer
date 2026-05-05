package org.example.backend.repository;

import org.example.backend.enums.AttemptStatus;
import org.example.backend.enums.PracticeSetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.UserPracticeAttempt;

import java.util.List;
import java.util.Optional;

public interface UserPracticeAttemptRepository extends JpaRepository<UserPracticeAttempt, Long> {
	Optional<UserPracticeAttempt> findTopByUserIdAndPracticeSetSetTypeAndStatusOrderBySubmittedAtDesc(
			Long userId,
			PracticeSetType setType,
			AttemptStatus status
	);

	Optional<UserPracticeAttempt> findByUserIdAndPracticeSetIdAndStatus(Long userId, Long practiceSetId, AttemptStatus status);

	List<UserPracticeAttempt> findByUserIdOrderByStartedAtDesc(Long userId);

	Optional<UserPracticeAttempt> findByIdAndUserId(Long id, Long userId);
}
