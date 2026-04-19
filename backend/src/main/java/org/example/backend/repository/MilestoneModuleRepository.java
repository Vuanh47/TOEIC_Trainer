package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.MilestoneModule;

import java.util.List;

public interface MilestoneModuleRepository extends JpaRepository<MilestoneModule, Long> {
	List<MilestoneModule> findByMilestoneIdOrderBySortOrderAsc(Long milestoneId);

	boolean existsByMilestoneIdAndModuleId(Long milestoneId, Long moduleId);
}
