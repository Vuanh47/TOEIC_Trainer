package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateMilestoneModuleRequest;
import org.example.backend.dto.request.UpdateMilestoneModuleRequest;
import org.example.backend.dto.response.MilestoneModuleResponse;
import org.example.backend.entity.LearningModule;
import org.example.backend.entity.LearningPathMilestone;
import org.example.backend.entity.MilestoneModule;
import org.example.backend.enums.ErrorCode;
import org.example.backend.exception.AppException;
import org.example.backend.mapper.MilestoneModuleMapper;
import org.example.backend.repository.LearningModuleRepository;
import org.example.backend.repository.LearningPathMilestoneRepository;
import org.example.backend.repository.MilestoneModuleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminMilestoneModuleService {

    private final LearningPathMilestoneRepository learningPathMilestoneRepository;
    private final LearningModuleRepository learningModuleRepository;
    private final MilestoneModuleRepository milestoneModuleRepository;
    private final MilestoneModuleMapper milestoneModuleMapper;

    @Transactional
    public MilestoneModuleResponse addModuleToMilestone(Long milestoneId, CreateMilestoneModuleRequest request) {
        if (request == null || request.getModuleId() == null || !isValidSortOrder(request.getSortOrder())) {
            throw new AppException(ErrorCode.INVALID_MILESTONE_MODULE_DATA);
        }

        LearningPathMilestone milestone = findMilestone(milestoneId);
        LearningModule module = findModule(request.getModuleId());

        if (milestoneModuleRepository.existsByMilestoneIdAndModuleId(milestoneId, request.getModuleId())) {
            throw new AppException(ErrorCode.MILESTONE_MODULE_EXISTED);
        }

        MilestoneModule milestoneModule = new MilestoneModule();
        milestoneModule.setMilestone(milestone);
        milestoneModule.setModule(module);
        milestoneModule.setSortOrder(request.getSortOrder());
        milestoneModule.setRequired(request.getRequired() == null ? true : request.getRequired());
        milestoneModule.setUnlockCondition(trimToNull(request.getUnlockCondition()));

        return milestoneModuleMapper.toResponse(milestoneModuleRepository.save(milestoneModule));
    }

    @Transactional(readOnly = true)
    public List<MilestoneModuleResponse> getModulesByMilestoneId(Long milestoneId) {
        findMilestone(milestoneId);
        return milestoneModuleMapper.toResponseList(
                milestoneModuleRepository.findByMilestoneIdOrderBySortOrderAsc(milestoneId)
        );
    }

    @Transactional
    public MilestoneModuleResponse updateMilestoneModule(Long milestoneId, Long milestoneModuleId, UpdateMilestoneModuleRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_MILESTONE_MODULE_DATA);
        }

        MilestoneModule milestoneModule = findMilestoneModuleBelongToMilestone(milestoneId, milestoneModuleId);

        if (request.getModuleId() != null) {
            if (!request.getModuleId().equals(milestoneModule.getModule().getId())
                    && milestoneModuleRepository.existsByMilestoneIdAndModuleId(milestoneId, request.getModuleId())) {
                throw new AppException(ErrorCode.MILESTONE_MODULE_EXISTED);
            }
            milestoneModule.setModule(findModule(request.getModuleId()));
        }

        if (request.getSortOrder() != null) {
            if (!isValidSortOrder(request.getSortOrder())) {
                throw new AppException(ErrorCode.INVALID_MILESTONE_MODULE_DATA);
            }
            milestoneModule.setSortOrder(request.getSortOrder());
        }

        if (request.getRequired() != null) {
            milestoneModule.setRequired(request.getRequired());
        }

        if (request.getUnlockCondition() != null) {
            milestoneModule.setUnlockCondition(trimToNull(request.getUnlockCondition()));
        }

        return milestoneModuleMapper.toResponse(milestoneModuleRepository.save(milestoneModule));
    }

    @Transactional
    public void removeMilestoneModule(Long milestoneId, Long milestoneModuleId) {
        MilestoneModule milestoneModule = findMilestoneModuleBelongToMilestone(milestoneId, milestoneModuleId);
        milestoneModuleRepository.delete(milestoneModule);
    }

    private LearningPathMilestone findMilestone(Long milestoneId) {
        return learningPathMilestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new AppException(ErrorCode.LEARNING_PATH_MILESTONE_NOT_FOUND));
    }

    private LearningModule findModule(Long moduleId) {
        return learningModuleRepository.findById(moduleId)
                .orElseThrow(() -> new AppException(ErrorCode.LEARNING_MODULE_NOT_FOUND));
    }

    private MilestoneModule findMilestoneModuleBelongToMilestone(Long milestoneId, Long milestoneModuleId) {
        MilestoneModule milestoneModule = milestoneModuleRepository.findById(milestoneModuleId)
                .orElseThrow(() -> new AppException(ErrorCode.MILESTONE_MODULE_NOT_FOUND));

        if (milestoneModule.getMilestone() == null
                || milestoneModule.getMilestone().getId() == null
                || !milestoneModule.getMilestone().getId().equals(milestoneId)) {
            throw new AppException(ErrorCode.MILESTONE_MODULE_NOT_FOUND);
        }

        return milestoneModule;
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

