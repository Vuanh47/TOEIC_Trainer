package org.example.backend.repository;

import org.example.backend.entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {
    List<Test> findByPublishedTrueOrderByCreatedAtDesc();
    List<Test> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(String title);
    List<Test> findAllByOrderByCreatedAtDesc();
}

