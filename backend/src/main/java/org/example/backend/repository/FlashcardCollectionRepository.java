package org.example.backend.repository;

import org.example.backend.entity.FlashcardCollection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FlashcardCollectionRepository extends JpaRepository<FlashcardCollection, Long> {
    List<FlashcardCollection> findByOwnerId(Long userId);

    List<FlashcardCollection> findByOwnerIdAndActiveTrueOrderBySortOrderAsc(Long userId);

    Optional<FlashcardCollection> findByIdAndOwnerId(Long collectionId, Long userId);
}

