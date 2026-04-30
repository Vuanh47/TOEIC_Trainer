package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.UserVocabularyProgress;
public interface UserVocabularyProgressRepository extends JpaRepository<UserVocabularyProgress, Long> {
}
