package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.VideoLesson;
public interface VideoLessonRepository extends JpaRepository<VideoLesson, Long> {
}
