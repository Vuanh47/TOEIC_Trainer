package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.VideoLesson;

import java.util.List;

public interface VideoLessonRepository extends JpaRepository<VideoLesson, Long> {
	List<VideoLesson> findByModuleIdOrderBySortOrderAsc(Long moduleId);
}
