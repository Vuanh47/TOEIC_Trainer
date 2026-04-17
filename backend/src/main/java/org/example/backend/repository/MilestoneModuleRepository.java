package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.MilestoneModule;
public interface MilestoneModuleRepository extends JpaRepository<MilestoneModule, Long> {
}
