package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.UserVideoProgress;

import java.util.List;
import java.util.Optional;

public interface UserVideoProgressRepository extends JpaRepository<UserVideoProgress, Long> {
    List<UserVideoProgress> findByUserIdAndLessonIdIn(Long userId, List<Long> lessonIds);

    Optional<UserVideoProgress> findByUserIdAndLessonId(Long userId, Long lessonId);
}
