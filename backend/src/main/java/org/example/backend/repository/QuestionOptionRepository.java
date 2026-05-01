package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.QuestionOption;
public interface QuestionOptionRepository extends JpaRepository<QuestionOption, Long> {
}
