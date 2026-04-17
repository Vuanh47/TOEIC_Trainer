package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.UserModuleProgress;
public interface UserModuleProgressRepository extends JpaRepository<UserModuleProgress, Long> {
}
