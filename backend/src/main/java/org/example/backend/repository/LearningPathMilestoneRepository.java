package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.LearningPathMilestone;
public interface LearningPathMilestoneRepository extends JpaRepository<LearningPathMilestone, Long> {
}
