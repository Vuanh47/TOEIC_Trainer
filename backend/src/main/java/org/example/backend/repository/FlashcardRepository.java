package org.example.backend.repository;

import org.example.backend.entity.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    List<Flashcard> findAllByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    List<Flashcard> findAllByModuleIdOrderByCreatedAtDesc(Long moduleId);

    List<Flashcard> findAllByModuleIdAndActiveTrueOrderByCreatedAtDesc(Long moduleId);

    long countByModuleIdAndActiveTrue(Long moduleId);

    @Query("""
            select f from Flashcard f
            where lower(f.englishWord) like lower(concat('%', :keyword, '%'))
               or lower(f.meaningVi) like lower(concat('%', :keyword, '%'))
            order by f.createdAt desc
            """)
    List<Flashcard> searchAllByKeyword(@Param("keyword") String keyword);

    @Query("""
            select f from Flashcard f
            where f.module.id = :moduleId
              and (
                    lower(f.englishWord) like lower(concat('%', :keyword, '%'))
                 or lower(f.meaningVi) like lower(concat('%', :keyword, '%'))
              )
            order by f.createdAt desc
            """)
    List<Flashcard> searchByModuleAndKeyword(@Param("moduleId") Long moduleId, @Param("keyword") String keyword);

    @Query("""
            select f from Flashcard f
            where f.module.id = :moduleId
              and f.active = true
              and (
                    lower(f.englishWord) like lower(concat('%', :keyword, '%'))
                 or lower(f.meaningVi) like lower(concat('%', :keyword, '%'))
              )
            order by f.createdAt desc
            """)
    List<Flashcard> searchActiveByModuleAndKeyword(@Param("moduleId") Long moduleId, @Param("keyword") String keyword);

    List<Flashcard> findByFlashcardCollectionId(Long collectionId);

    long countByFlashcardCollectionId(Long collectionId);
}

