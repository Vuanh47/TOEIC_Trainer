package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.PracticeSet;

import java.util.List;

public interface PracticeSetRepository extends JpaRepository<PracticeSet, Long> {
	List<PracticeSet> findByModuleIdOrderByCreatedAtDesc(Long moduleId);
}
