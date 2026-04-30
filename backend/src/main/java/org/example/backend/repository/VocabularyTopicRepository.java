package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.VocabularyTopic;
public interface VocabularyTopicRepository extends JpaRepository<VocabularyTopic, Long> {
}
