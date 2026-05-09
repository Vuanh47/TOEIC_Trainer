package org.example.backend.repository;

import org.example.backend.entity.UserFavoriteGrammar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserFavoriteGrammarRepository extends JpaRepository<UserFavoriteGrammar, Long> {

    List<UserFavoriteGrammar> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<UserFavoriteGrammar> findByUserIdAndGrammarId(Long userId, Long grammarId);

    boolean existsByUserIdAndGrammarId(Long userId, Long grammarId);

    void deleteByUserIdAndGrammarId(Long userId, Long grammarId);
}

