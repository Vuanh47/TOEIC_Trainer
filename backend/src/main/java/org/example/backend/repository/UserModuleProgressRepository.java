package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.UserModuleProgress;

import java.util.List;
import java.util.Optional;

public interface UserModuleProgressRepository extends JpaRepository<UserModuleProgress, Long> {
    List<UserModuleProgress> findByUserIdAndModuleIdIn(Long userId, List<Long> moduleIds);

    Optional<UserModuleProgress> findByUserIdAndModuleId(Long userId, Long moduleId);
}
