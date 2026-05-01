package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.LearningPathMilestone;

import java.util.List;

public interface LearningPathMilestoneRepository extends JpaRepository<LearningPathMilestone, Long> {
	List<LearningPathMilestone> findByLearningPathIdOrderBySortOrderAsc(Long learningPathId);
}
