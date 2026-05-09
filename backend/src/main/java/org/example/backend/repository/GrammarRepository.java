package org.example.backend.repository;

import org.example.backend.entity.Grammar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GrammarRepository extends JpaRepository<Grammar, Long> {

    boolean existsByTitleIgnoreCase(String title);

    List<Grammar> findAllByOrderByCreatedAtDesc();
}
