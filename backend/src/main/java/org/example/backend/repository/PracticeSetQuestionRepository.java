package org.example.backend.repository;

import org.example.backend.entity.PracticeSetQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PracticeSetQuestionRepository extends JpaRepository<PracticeSetQuestion, Long> {
    List<PracticeSetQuestion> findByPracticeSetIdOrderBySortOrderAsc(Long practiceSetId);

    Optional<PracticeSetQuestion> findByPracticeSetIdAndQuestionId(Long practiceSetId, Long questionId);

    boolean existsByPracticeSetIdAndQuestionId(Long practiceSetId, Long questionId);

    void deleteByPracticeSetId(Long practiceSetId);

    void deleteByQuestionId(Long questionId);
}
