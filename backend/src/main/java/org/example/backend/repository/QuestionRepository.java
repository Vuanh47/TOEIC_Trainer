package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.Question;
public interface QuestionRepository extends JpaRepository<Question, Long> {
}
