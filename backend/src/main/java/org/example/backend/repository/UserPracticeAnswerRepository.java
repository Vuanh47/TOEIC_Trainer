package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.UserPracticeAnswer;
public interface UserPracticeAnswerRepository extends JpaRepository<UserPracticeAnswer, Long> {
}
