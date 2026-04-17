package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.Vocabulary;
public interface VocabularyRepository extends JpaRepository<Vocabulary, Long> {
}
