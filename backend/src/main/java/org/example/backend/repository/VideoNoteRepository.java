package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.VideoNote;
public interface VideoNoteRepository extends JpaRepository<VideoNote, Long> {
}
