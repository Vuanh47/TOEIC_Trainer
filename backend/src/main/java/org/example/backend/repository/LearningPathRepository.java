package org.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.LearningPath;

import java.util.List;
import java.util.Optional;

public interface LearningPathRepository extends JpaRepository<LearningPath, Long> {
	Optional<LearningPath> findFirstByActiveTrueAndTargetScoreGreaterThanEqualOrderByTargetScoreAsc(Integer score);

	Optional<LearningPath> findFirstByActiveTrueOrderByTargetScoreDesc();

	boolean existsByCodeIgnoreCase(String code);

	List<LearningPath> findAllByOrderByTargetScoreAsc();
}
