package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.VideoLesson;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VideoLessonRepository extends JpaRepository<VideoLesson, Long> {
	List<VideoLesson> findByModuleIdOrderBySortOrderAsc(Long moduleId);

	List<VideoLesson> findByModuleIdAndPublishedTrueOrderBySortOrderAsc(Long moduleId);

	long countByModuleIdAndPublishedTrue(Long moduleId);

	@Query("""
			select vl
			from VideoLesson vl
			join fetch vl.module m
			where vl.published = true and m.active = true
			order by m.id asc, vl.sortOrder asc
			""")
	List<VideoLesson> findPublishedLessonsForUser();
}
