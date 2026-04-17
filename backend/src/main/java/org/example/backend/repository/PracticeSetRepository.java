package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.PracticeSet;
public interface PracticeSetRepository extends JpaRepository<PracticeSet, Long> {
}
