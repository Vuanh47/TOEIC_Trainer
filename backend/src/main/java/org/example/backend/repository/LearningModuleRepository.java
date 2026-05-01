package org.example.backend.repository;

import org.example.backend.entity.LearningModule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearningModuleRepository extends JpaRepository<LearningModule, Long> {
	boolean existsByTitleIgnoreCase(String title);

	List<LearningModule> findAllByOrderByCreatedAtDesc();
}
