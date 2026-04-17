package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.UserVideoProgress;
public interface UserVideoProgressRepository extends JpaRepository<UserVideoProgress, Long> {
}
