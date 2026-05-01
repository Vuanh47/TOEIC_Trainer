package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateLearningPathMilestoneRequest;
import org.example.backend.dto.request.UpdateLearningPathMilestoneRequest;
import org.example.backend.dto.response.LearningPathMilestoneResponse;
import org.example.backend.entity.LearningPath;
import org.example.backend.entity.LearningPathMilestone;
import org.example.backend.enums.ErrorCode;
import org.example.backend.exception.AppException;
import org.example.backend.mapper.LearningPathMilestoneMapper;
import org.example.backend.repository.LearningPathMilestoneRepository;
import org.example.backend.repository.LearningPathRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminLearningPathMilestoneService {

    private final LearningPathRepository learningPathRepository;
    private final LearningPathMilestoneRepository learningPathMilestoneRepository;
    private final LearningPathMilestoneMapper learningPathMilestoneMapper;

    @Transactional
    public LearningPathMilestoneResponse createMilestone(Long learningPathId, CreateLearningPathMilestoneRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_LEARNING_PATH_MILESTONE_DATA);
        }

        String title = trimToNull(request.getTitle());
        Integer sortOrder = request.getSortOrder();
        if (title == null || !isValidSortOrder(sortOrder)) {
            throw new AppException(ErrorCode.INVALID_LEARNING_PATH_MILESTONE_DATA);
        }

        LearningPath learningPath = findLearningPath(learningPathId);

        LearningPathMilestone milestone = new LearningPathMilestone();
        milestone.setLearningPath(learningPath);
        milestone.setTitle(title);
        milestone.setDescription(trimToNull(request.getDescription()));
        milestone.setSortOrder(sortOrder);

        return learningPathMilestoneMapper.toResponse(learningPathMilestoneRepository.save(milestone));
    }

    @Transactional(readOnly = true)
    public List<LearningPathMilestoneResponse> getMilestonesByPathId(Long learningPathId) {
        findLearningPath(learningPathId);
        return learningPathMilestoneMapper.toResponseList(
                learningPathMilestoneRepository.findByLearningPathIdOrderBySortOrderAsc(learningPathId)
        );
    }

    @Transactional
    public LearningPathMilestoneResponse updateMilestone(
            Long learningPathId,
            Long milestoneId,
            UpdateLearningPathMilestoneRequest request
    ) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_LEARNING_PATH_MILESTONE_DATA);
        }

        LearningPathMilestone milestone = findMilestoneBelongToPath(learningPathId, milestoneId);

        if (request.getTitle() != null) {
            String title = trimToNull(request.getTitle());
            if (title == null) {
                throw new AppException(ErrorCode.INVALID_LEARNING_PATH_MILESTONE_DATA);
            }
            milestone.setTitle(title);
        }

        if (request.getDescription() != null) {
            milestone.setDescription(trimToNull(request.getDescription()));
        }

        if (request.getSortOrder() != null) {
            if (!isValidSortOrder(request.getSortOrder())) {
                throw new AppException(ErrorCode.INVALID_LEARNING_PATH_MILESTONE_DATA);
            }
            milestone.setSortOrder(request.getSortOrder());
        }

        return learningPathMilestoneMapper.toResponse(learningPathMilestoneRepository.save(milestone));
    }

    @Transactional
    public void deleteMilestone(Long learningPathId, Long milestoneId) {
        LearningPathMilestone milestone = findMilestoneBelongToPath(learningPathId, milestoneId);
        learningPathMilestoneRepository.delete(milestone);
    }

    private LearningPath findLearningPath(Long learningPathId) {
        return learningPathRepository.findById(learningPathId)
                .orElseThrow(() -> new AppException(ErrorCode.LEARNING_PATH_NOT_FOUND));
    }

    private LearningPathMilestone findMilestoneBelongToPath(Long learningPathId, Long milestoneId) {
        LearningPathMilestone milestone = learningPathMilestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new AppException(ErrorCode.LEARNING_PATH_MILESTONE_NOT_FOUND));

        if (milestone.getLearningPath() == null
                || milestone.getLearningPath().getId() == null
                || !milestone.getLearningPath().getId().equals(learningPathId)) {
            throw new AppException(ErrorCode.LEARNING_PATH_MILESTONE_NOT_FOUND);
        }

        return milestone;
    }

    private boolean isValidSortOrder(Integer sortOrder) {
        return sortOrder != null && sortOrder > 0;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}

