package org.example.backend.repository;

import org.example.backend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findAllByOrderByCreatedAtDesc();

    List<Question> findByQuestionTextContainingIgnoreCaseOrderByCreatedAtDesc(String keyword);
}
