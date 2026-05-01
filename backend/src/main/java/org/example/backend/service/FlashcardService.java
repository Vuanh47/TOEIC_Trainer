package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateAdminFlashcardRequest;
import org.example.backend.dto.request.CreatePersonalFlashcardRequest;
import org.example.backend.dto.request.UpdateAdminFlashcardRequest;
import org.example.backend.dto.request.UpdatePersonalFlashcardRequest;
import org.example.backend.dto.request.CreateFlashcardCollectionRequest;
import org.example.backend.dto.request.UpdateFlashcardCollectionRequest;
import org.example.backend.dto.response.FlashcardCollectionResponse;
import org.example.backend.dto.response.FlashcardResponse;
import org.example.backend.entity.Flashcard;
import org.example.backend.entity.FlashcardCollection;
import org.example.backend.entity.LearningModule;
import org.example.backend.entity.User;
import org.example.backend.enums.ErrorCode;
import org.example.backend.exception.AppException;
import org.example.backend.mapper.FlashcardMapper;
import org.example.backend.repository.FlashcardRepository;
import org.example.backend.repository.FlashcardCollectionRepository;
import org.example.backend.repository.LearningModuleRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;
    private final FlashcardCollectionRepository flashcardCollectionRepository;
    private final UserRepository userRepository;
    private final LearningModuleRepository learningModuleRepository;
    private final FlashcardMapper flashcardMapper;

    @Transactional
    public FlashcardResponse createPersonalFlashcard(String email, CreatePersonalFlashcardRequest request) {
        validatePersonalRequest(request);

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Flashcard flashcard = new Flashcard();
        flashcard.setOwner(owner);
        flashcard.setEnglishWord(trimToNull(request.getEnglishWord()));
        flashcard.setMeaningVi(trimToNull(request.getMeaningVi()));
        flashcard.setExampleSentence(trimToNull(request.getExampleSentence()));
        flashcard.setPronunciation(trimToNull(request.getPronunciation()));
        flashcard.setActive(true);

        return flashcardMapper.toResponse(flashcardRepository.save(flashcard));
    }

    @Transactional
    public FlashcardResponse createAdminFlashcard(CreateAdminFlashcardRequest request) {
        validateAdminRequest(request);

        LearningModule module = learningModuleRepository.findById(request.getModuleId())
                .orElseThrow(() -> new AppException(ErrorCode.LEARNING_MODULE_NOT_FOUND));

        Flashcard flashcard = new Flashcard();
        flashcard.setModule(module);
        flashcard.setEnglishWord(trimToNull(request.getEnglishWord()));
        flashcard.setMeaningVi(trimToNull(request.getMeaningVi()));
        flashcard.setExampleSentence(trimToNull(request.getExampleSentence()));
        flashcard.setPronunciation(trimToNull(request.getPronunciation()));
        flashcard.setActive(request.getActive() == null ? true : request.getActive());

        return flashcardMapper.toResponse(flashcardRepository.save(flashcard));
    }

    @Transactional
    public FlashcardResponse updateAdminFlashcard(Long flashcardId, UpdateAdminFlashcardRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_FLASHCARD_DATA);
        }

        Flashcard flashcard = findFlashcard(flashcardId);

        if (request.getModuleId() != null) {
            LearningModule module = learningModuleRepository.findById(request.getModuleId())
                    .orElseThrow(() -> new AppException(ErrorCode.LEARNING_MODULE_NOT_FOUND));
            flashcard.setModule(module);
        }

        if (request.getEnglishWord() != null) {
            String englishWord = trimToNull(request.getEnglishWord());
            if (englishWord == null) {
                throw new AppException(ErrorCode.INVALID_FLASHCARD_DATA);
            }
            flashcard.setEnglishWord(englishWord);
        }

        if (request.getMeaningVi() != null) {
            String meaningVi = trimToNull(request.getMeaningVi());
            if (meaningVi == null) {
                throw new AppException(ErrorCode.INVALID_FLASHCARD_DATA);
            }
            flashcard.setMeaningVi(meaningVi);
        }

        if (request.getExampleSentence() != null) {
            flashcard.setExampleSentence(trimToNull(request.getExampleSentence()));
        }

        if (request.getPronunciation() != null) {
            flashcard.setPronunciation(trimToNull(request.getPronunciation()));
        }

        if (request.getActive() != null) {
            flashcard.setActive(request.getActive());
        }

        return flashcardMapper.toResponse(flashcardRepository.save(flashcard));
    }

    @Transactional
    public void deleteAdminFlashcard(Long flashcardId) {
        Flashcard flashcard = findFlashcard(flashcardId);
        flashcardRepository.delete(flashcard);
    }

    @Transactional(readOnly = true)
    public List<FlashcardResponse> getMyFlashcards(String email) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return flashcardMapper.toResponseList(
                flashcardRepository.findAllByOwnerIdOrderByCreatedAtDesc(owner.getId())
        );
    }

    @Transactional(readOnly = true)
    public List<FlashcardResponse> getModuleFlashcardsForUser(Long moduleId) {
        ensureModuleExists(moduleId);
        return flashcardMapper.toResponseList(
                flashcardRepository.findAllByModuleIdAndActiveTrueOrderByCreatedAtDesc(moduleId)
        );
    }

    @Transactional(readOnly = true)
    public List<FlashcardResponse> searchModuleFlashcardsForUser(Long moduleId, String keyword) {
        ensureModuleExists(moduleId);
        String normalizedKeyword = normalizeKeyword(keyword);

        return flashcardMapper.toResponseList(
                flashcardRepository.searchActiveByModuleAndKeyword(moduleId, normalizedKeyword)
        );
    }

    @Transactional(readOnly = true)
    public List<FlashcardResponse> getModuleFlashcardsForAdmin(Long moduleId) {
        ensureModuleExists(moduleId);
        return flashcardMapper.toResponseList(
                flashcardRepository.findAllByModuleIdOrderByCreatedAtDesc(moduleId)
        );
    }

    @Transactional(readOnly = true)
    public List<FlashcardResponse> searchModuleFlashcardsForAdmin(Long moduleId, String keyword) {
        ensureModuleExists(moduleId);
        String normalizedKeyword = normalizeKeyword(keyword);

        return flashcardMapper.toResponseList(
                flashcardRepository.searchByModuleAndKeyword(moduleId, normalizedKeyword)
        );
    }

    @Transactional(readOnly = true)
    public List<FlashcardResponse> searchFlashcardsForAdmin(String keyword) {
        String normalizedKeyword = normalizeKeyword(keyword);
        return flashcardMapper.toResponseList(
                flashcardRepository.searchAllByKeyword(normalizedKeyword)
        );
    }

    private void validatePersonalRequest(CreatePersonalFlashcardRequest request) {
        if (request == null || trimToNull(request.getEnglishWord()) == null || trimToNull(request.getMeaningVi()) == null) {
            throw new AppException(ErrorCode.INVALID_FLASHCARD_DATA);
        }
    }

    private void validateAdminRequest(CreateAdminFlashcardRequest request) {
        if (request == null
                || request.getModuleId() == null
                || trimToNull(request.getEnglishWord()) == null
                || trimToNull(request.getMeaningVi()) == null) {
            throw new AppException(ErrorCode.INVALID_FLASHCARD_DATA);
        }
    }

    private void ensureModuleExists(Long moduleId) {
        if (moduleId == null || !learningModuleRepository.existsById(moduleId)) {
            throw new AppException(ErrorCode.LEARNING_MODULE_NOT_FOUND);
        }
    }

    private Flashcard findFlashcard(Long flashcardId) {
        return flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new AppException(ErrorCode.FLASHCARD_NOT_FOUND));
    }

    private String normalizeKeyword(String keyword) {
        String normalized = trimToNull(keyword);
        if (normalized == null) {
            throw new AppException(ErrorCode.INVALID_FLASHCARD_DATA);
        }
        return normalized;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    // Personal flashcard update/delete
    @Transactional
    public FlashcardResponse updatePersonalFlashcard(String email, Long flashcardId, UpdatePersonalFlashcardRequest request) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Flashcard flashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new AppException(ErrorCode.FLASHCARD_NOT_FOUND));

        if (!flashcard.getOwner().getId().equals(owner.getId())) {
            throw new AppException(ErrorCode.INVALID_FLASHCARD_DATA);
        }

        if (request.getEnglishWord() != null) flashcard.setEnglishWord(trimToNull(request.getEnglishWord()));
        if (request.getMeaningVi() != null) flashcard.setMeaningVi(trimToNull(request.getMeaningVi()));
        if (request.getExampleSentence() != null) flashcard.setExampleSentence(trimToNull(request.getExampleSentence()));
        if (request.getPronunciation() != null) flashcard.setPronunciation(trimToNull(request.getPronunciation()));
        if (request.getFlashcardCollectionId() != null) {
            FlashcardCollection collection = flashcardCollectionRepository.findByIdAndOwnerId(request.getFlashcardCollectionId(), owner.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.INVALID_FLASHCARD_DATA));
            flashcard.setFlashcardCollection(collection);
        }

        return flashcardMapper.toResponse(flashcardRepository.save(flashcard));
    }

    @Transactional
    public void deletePersonalFlashcard(String email, Long flashcardId) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Flashcard flashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new AppException(ErrorCode.FLASHCARD_NOT_FOUND));

        if (!flashcard.getOwner().getId().equals(owner.getId())) {
            throw new AppException(ErrorCode.INVALID_FLASHCARD_DATA);
        }

        flashcardRepository.delete(flashcard);
    }

    // Collection management
    @Transactional
    public FlashcardCollectionResponse createCollection(String email, CreateFlashcardCollectionRequest request) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        FlashcardCollection collection = new FlashcardCollection();
        collection.setName(trimToNull(request.getName()));
        collection.setDescription(trimToNull(request.getDescription()));
        collection.setOwner(owner);
        collection.setActive(true);
        collection.setSortOrder(0);

        return toCollectionResponse(flashcardCollectionRepository.save(collection));
    }

    @Transactional(readOnly = true)
    public List<FlashcardCollectionResponse> getMyCollections(String email) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return flashcardCollectionRepository.findByOwnerIdAndActiveTrueOrderBySortOrderAsc(owner.getId())
                .stream()
                .map(this::toCollectionResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public FlashcardCollectionResponse getCollectionDetail(String email, Long collectionId) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        FlashcardCollection collection = flashcardCollectionRepository.findByIdAndOwnerId(collectionId, owner.getId())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_FLASHCARD_DATA));

        FlashcardCollectionResponse response = toCollectionResponse(collection);
        List<FlashcardResponse> flashcards = flashcardRepository.findByFlashcardCollectionId(collectionId)
                .stream()
                .map(flashcardMapper::toResponse)
                .toList();
        response.setFlashcards(flashcards);
        return response;
    }

    @Transactional
    public FlashcardCollectionResponse updateCollection(String email, Long collectionId, UpdateFlashcardCollectionRequest request) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        FlashcardCollection collection = flashcardCollectionRepository.findByIdAndOwnerId(collectionId, owner.getId())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_FLASHCARD_DATA));

        if (request.getName() != null) collection.setName(trimToNull(request.getName()));
        if (request.getDescription() != null) collection.setDescription(trimToNull(request.getDescription()));

        return toCollectionResponse(flashcardCollectionRepository.save(collection));
    }

    @Transactional
    public void deleteCollection(String email, Long collectionId) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        FlashcardCollection collection = flashcardCollectionRepository.findByIdAndOwnerId(collectionId, owner.getId())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_FLASHCARD_DATA));

        // Remove collection reference from all flashcards in this collection
        flashcardRepository.findByFlashcardCollectionId(collectionId)
                .forEach(flashcard -> flashcard.setFlashcardCollection(null));

        flashcardCollectionRepository.delete(collection);
    }

    private FlashcardCollectionResponse toCollectionResponse(FlashcardCollection collection) {
        FlashcardCollectionResponse response = new FlashcardCollectionResponse();
        response.setId(collection.getId());
        response.setName(collection.getName());
        response.setDescription(collection.getDescription());
        response.setSortOrder(collection.getSortOrder());
        response.setActive(collection.getActive());
        response.setCreatedAt(collection.getCreatedAt());
        response.setUpdatedAt(collection.getUpdatedAt());
        response.setFlashcardCount((int) flashcardRepository.countByFlashcardCollectionId(collection.getId()));
        return response;
    }
}

