package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateLearningModuleRequest;
import org.example.backend.dto.request.UpdateLearningModuleRequest;
import org.example.backend.dto.response.LearningModuleResponse;
import org.example.backend.entity.LearningModule;
import org.example.backend.enums.ErrorCode;
import org.example.backend.exception.AppException;
import org.example.backend.mapper.LearningModuleMapper;
import org.example.backend.repository.LearningModuleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminLearningModuleService {

    private final LearningModuleRepository learningModuleRepository;
    private final LearningModuleMapper learningModuleMapper;

    @Transactional(readOnly = true)
    public List<LearningModuleResponse> getAllLearningModules() {
        return learningModuleMapper.toResponseList(learningModuleRepository.findAllByOrderByCreatedAtDesc());
    }

    @Transactional(readOnly = true)
    public LearningModuleResponse getLearningModuleById(Long id) {
        return learningModuleMapper.toResponse(findLearningModule(id));
    }

    @Transactional
    public LearningModuleResponse createLearningModule(CreateLearningModuleRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_LEARNING_MODULE_DATA);
        }

        String title = trimToNull(request.getTitle());
        if (request.getModuleType() == null || title == null || !isValidEstimatedMinutes(request.getEstimatedMinutes())) {
            throw new AppException(ErrorCode.INVALID_LEARNING_MODULE_DATA);
        }

        if (learningModuleRepository.existsByTitleIgnoreCase(title)) {
            throw new AppException(ErrorCode.LEARNING_MODULE_TITLE_EXISTED);
        }

        LearningModule learningModule = new LearningModule();
        learningModule.setModuleType(request.getModuleType());
        learningModule.setTitle(title);
        learningModule.setDescription(trimToNull(request.getDescription()));
        learningModule.setThumbnailUrl(trimToNull(request.getThumbnailUrl()));
        learningModule.setEstimatedMinutes(request.getEstimatedMinutes());
        learningModule.setDifficultyLevel(trimToNull(request.getDifficultyLevel()));
        learningModule.setActive(request.getActive() == null ? true : request.getActive());

        return learningModuleMapper.toResponse(learningModuleRepository.save(learningModule));
    }

    @Transactional
    public LearningModuleResponse updateLearningModule(Long id, UpdateLearningModuleRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_LEARNING_MODULE_DATA);
        }

        LearningModule learningModule = findLearningModule(id);

        if (request.getModuleType() != null) {
            learningModule.setModuleType(request.getModuleType());
        }

        if (request.getTitle() != null) {
            String title = trimToNull(request.getTitle());
            if (title == null) {
                throw new AppException(ErrorCode.INVALID_LEARNING_MODULE_DATA);
            }

            if (!learningModule.getTitle().equalsIgnoreCase(title)
                    && learningModuleRepository.existsByTitleIgnoreCase(title)) {
                throw new AppException(ErrorCode.LEARNING_MODULE_TITLE_EXISTED);
            }
            learningModule.setTitle(title);
        }

        if (request.getDescription() != null) {
            learningModule.setDescription(trimToNull(request.getDescription()));
        }

        if (request.getThumbnailUrl() != null) {
            learningModule.setThumbnailUrl(trimToNull(request.getThumbnailUrl()));
        }

        if (request.getEstimatedMinutes() != null) {
            if (!isValidEstimatedMinutes(request.getEstimatedMinutes())) {
                throw new AppException(ErrorCode.INVALID_LEARNING_MODULE_DATA);
            }
            learningModule.setEstimatedMinutes(request.getEstimatedMinutes());
        }

        if (request.getDifficultyLevel() != null) {
            learningModule.setDifficultyLevel(trimToNull(request.getDifficultyLevel()));
        }

        if (request.getActive() != null) {
            learningModule.setActive(request.getActive());
        }

        return learningModuleMapper.toResponse(learningModuleRepository.save(learningModule));
    }

    @Transactional
    public void deactivateLearningModule(Long id) {
        LearningModule learningModule = findLearningModule(id);
        learningModule.setActive(false);
        learningModuleRepository.save(learningModule);
    }

    private LearningModule findLearningModule(Long id) {
        return learningModuleRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LEARNING_MODULE_NOT_FOUND));
    }

    private boolean isValidEstimatedMinutes(Integer estimatedMinutes) {
        return estimatedMinutes != null && estimatedMinutes > 0;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}

