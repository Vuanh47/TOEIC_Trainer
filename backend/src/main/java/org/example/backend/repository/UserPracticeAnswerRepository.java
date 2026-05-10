package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.UserPracticeAnswer;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface UserPracticeAnswerRepository extends JpaRepository<UserPracticeAnswer, Long> {
	List<UserPracticeAnswer> findByAttemptIdOrderByIdAsc(Long attemptId);

	@Modifying
	@Query("delete from UserPracticeAnswer a where a.attempt.practiceSet.id = :practiceSetId")
	void deleteByPracticeSetId(@Param("practiceSetId") Long practiceSetId);

	@Modifying
	@Query("delete from UserPracticeAnswer a where a.attempt.practiceSet.module.id = :moduleId")
	void deleteByModuleId(@Param("moduleId") Long moduleId);
}
