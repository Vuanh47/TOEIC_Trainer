package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.VideoNote;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
public interface VideoNoteRepository extends JpaRepository<VideoNote, Long> {

	void deleteByLessonId(Long lessonId);

	@Modifying
	@Query("delete from VideoNote n where n.lesson.module.id = :moduleId")
	void deleteByModuleId(@Param("moduleId") Long moduleId);
}
