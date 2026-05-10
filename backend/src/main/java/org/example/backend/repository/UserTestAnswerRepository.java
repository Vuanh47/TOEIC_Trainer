package org.example.backend.repository;

import org.example.backend.entity.UserTestAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserTestAnswerRepository extends JpaRepository<UserTestAnswer, Long> {
    List<UserTestAnswer> findByAttemptIdOrderByIdAsc(Long attemptId);

    @Modifying
    @Query("delete from UserTestAnswer a where a.testPartQuestion.id = :tpqId")
    void deleteByTestPartQuestionId(@Param("tpqId") Long testPartQuestionId);

    @Modifying
    @Query("delete from UserTestAnswer a where a.testPartQuestion.testPart.id = :testPartId")
    void deleteByTestPartId(@Param("testPartId") Long testPartId);

    @Modifying
    @Query("delete from UserTestAnswer a where a.attempt.test.id = :testId")
    void deleteByTestId(@Param("testId") Long testId);
}

