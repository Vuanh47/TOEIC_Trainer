package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateAdminFlashcardRequest;
import org.example.backend.dto.request.CreatePersonalFlashcardRequest;
import org.example.backend.dto.request.UpdateAdminFlashcardRequest;
import org.example.backend.dto.response.FlashcardResponse;
import org.example.backend.entity.Flashcard;
import org.example.backend.entity.LearningModule;
import org.example.backend.entity.User;
import org.example.backend.enums.ErrorCode;
import org.example.backend.exception.AppException;
import org.example.backend.mapper.FlashcardMapper;
import org.example.backend.repository.FlashcardRepository;
import org.example.backend.repository.LearningModuleRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;
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
}

