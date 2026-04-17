package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateLearningPathRequest;
import org.example.backend.dto.request.UpdateLearningPathRequest;
import org.example.backend.dto.response.LearningPathResponse;
import org.example.backend.entity.LearningPath;
import org.example.backend.enums.ErrorCode;
import org.example.backend.exception.AppException;
import org.example.backend.mapper.LearningPathMapper;
import org.example.backend.repository.LearningPathRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminLearningPathService {

    private final LearningPathRepository learningPathRepository;
    private final LearningPathMapper learningPathMapper;

    @Transactional
    public LearningPathResponse createLearningPath(CreateLearningPathRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_LEARNING_PATH_DATA);
        }

        String code = normalizeCode(request.getCode());
        String title = trimToNull(request.getTitle());
        Integer targetScore = request.getTargetScore();

        if (code == null || title == null || !isValidTargetScore(targetScore)) {
            throw new AppException(ErrorCode.INVALID_LEARNING_PATH_DATA);
        }

        if (learningPathRepository.existsByCodeIgnoreCase(code)) {
            throw new AppException(ErrorCode.LEARNING_PATH_CODE_EXISTED);
        }

        LearningPath learningPath = new LearningPath();
        learningPath.setCode(code);
        learningPath.setTitle(title);
        learningPath.setDescription(trimToNull(request.getDescription()));
        learningPath.setTargetScore(targetScore);
        learningPath.setActive(request.getActive() == null ? true : request.getActive());

        return learningPathMapper.toResponse(learningPathRepository.save(learningPath));
    }

    @Transactional(readOnly = true)
    public List<LearningPathResponse> getAllLearningPaths() {
        return learningPathMapper.toResponseList(learningPathRepository.findAllByOrderByTargetScoreAsc());
    }

    @Transactional(readOnly = true)
    public LearningPathResponse getLearningPathById(Long id) {
        LearningPath learningPath = findLearningPath(id);
        return learningPathMapper.toResponse(learningPath);
    }

    @Transactional
    public LearningPathResponse updateLearningPath(Long id, UpdateLearningPathRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_LEARNING_PATH_DATA);
        }

        LearningPath learningPath = findLearningPath(id);

        if (request.getCode() != null) {
            String code = normalizeCode(request.getCode());
            if (code == null) {
                throw new AppException(ErrorCode.INVALID_LEARNING_PATH_DATA);
            }

            if (!learningPath.getCode().equalsIgnoreCase(code)
                    && learningPathRepository.existsByCodeIgnoreCase(code)) {
                throw new AppException(ErrorCode.LEARNING_PATH_CODE_EXISTED);
            }
            learningPath.setCode(code);
        }

        if (request.getTitle() != null) {
            String title = trimToNull(request.getTitle());
            if (title == null) {
                throw new AppException(ErrorCode.INVALID_LEARNING_PATH_DATA);
            }
            learningPath.setTitle(title);
        }

        if (request.getDescription() != null) {
            learningPath.setDescription(trimToNull(request.getDescription()));
        }

        if (request.getTargetScore() != null) {
            if (!isValidTargetScore(request.getTargetScore())) {
                throw new AppException(ErrorCode.INVALID_TARGET_SCORE);
            }
            learningPath.setTargetScore(request.getTargetScore());
        }

        if (request.getActive() != null) {
            learningPath.setActive(request.getActive());
        }

        return learningPathMapper.toResponse(learningPathRepository.save(learningPath));
    }

    @Transactional
    public void deactivateLearningPath(Long id) {
        LearningPath learningPath = findLearningPath(id);
        learningPath.setActive(false);
        learningPathRepository.save(learningPath);
    }

    private LearningPath findLearningPath(Long id) {
        return learningPathRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LEARNING_PATH_NOT_FOUND));
    }

    private boolean isValidTargetScore(Integer targetScore) {
        return targetScore != null && targetScore >= 10 && targetScore <= 990;
    }

    private String normalizeCode(String value) {
        String trimmed = trimToNull(value);
        return trimmed == null ? null : trimmed.toUpperCase();
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
