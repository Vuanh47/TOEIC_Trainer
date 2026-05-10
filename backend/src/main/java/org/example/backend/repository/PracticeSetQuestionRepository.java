package org.example.backend.repository;

import org.example.backend.entity.PracticeSetQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PracticeSetQuestionRepository extends JpaRepository<PracticeSetQuestion, Long> {
    List<PracticeSetQuestion> findByPracticeSetIdOrderBySortOrderAsc(Long practiceSetId);

    Optional<PracticeSetQuestion> findByPracticeSetIdAndQuestionId(Long practiceSetId, Long questionId);

    boolean existsByPracticeSetIdAndQuestionId(Long practiceSetId, Long questionId);

    void deleteByPracticeSetId(Long practiceSetId);

    @Modifying
    @Query("delete from PracticeSetQuestion q where q.practiceSet.module.id = :moduleId")
    void deleteByModuleId(@Param("moduleId") Long moduleId);

    void deleteByQuestionId(Long questionId);
}
