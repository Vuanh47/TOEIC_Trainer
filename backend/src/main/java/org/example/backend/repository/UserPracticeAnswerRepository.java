package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.UserPracticeAnswer;
import java.util.List;
public interface UserPracticeAnswerRepository extends JpaRepository<UserPracticeAnswer, Long> {
	List<UserPracticeAnswer> findByAttemptIdOrderByIdAsc(Long attemptId);
}
