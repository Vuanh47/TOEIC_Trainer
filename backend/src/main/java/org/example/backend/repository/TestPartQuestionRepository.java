package org.example.backend.repository;

import org.example.backend.entity.TestPartQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestPartQuestionRepository extends JpaRepository<TestPartQuestion, Long> {
    List<TestPartQuestion> findByTestPartIdOrderBySortOrderAsc(Long testPartId);
    void deleteByTestPartId(Long testPartId);
    void deleteByQuestionId(Long questionId);
}

