package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.response.FlashcardResponse;
import org.example.backend.dto.response.PracticeSetResponse;
import org.example.backend.dto.response.UserModuleContentResponse;
import org.example.backend.dto.response.UserRoadmapResponse;
import org.example.backend.entity.LearningModule;
import org.example.backend.entity.LearningPathMilestone;
import org.example.backend.entity.MilestoneModule;
import org.example.backend.entity.User;
import org.example.backend.entity.UserLearningPath;
import org.example.backend.entity.UserModuleProgress;
import org.example.backend.enums.ErrorCode;
import org.example.backend.enums.PathStatus;
import org.example.backend.enums.ProgressStatus;
import org.example.backend.exception.AppException;
import org.example.backend.mapper.FlashcardMapper;
import org.example.backend.mapper.PracticeSetMapper;
import org.example.backend.repository.FlashcardRepository;
import org.example.backend.repository.LearningModuleRepository;
import org.example.backend.repository.LearningPathMilestoneRepository;
import org.example.backend.repository.MilestoneModuleRepository;
import org.example.backend.repository.PracticeSetRepository;
import org.example.backend.repository.UserLearningPathRepository;
import org.example.backend.repository.UserModuleProgressRepository;
import org.example.backend.repository.UserRepository;
import org.example.backend.repository.VideoLessonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserLearningService {

    private final UserRepository userRepository;
    private final UserLearningPathRepository userLearningPathRepository;
    private final LearningPathMilestoneRepository learningPathMilestoneRepository;
    private final MilestoneModuleRepository milestoneModuleRepository;
    private final UserModuleProgressRepository userModuleProgressRepository;
    private final LearningModuleRepository learningModuleRepository;
    private final VideoLessonRepository videoLessonRepository;
    private final FlashcardRepository flashcardRepository;
    private final PracticeSetRepository practiceSetRepository;
    private final UserLessonService userLessonService;
    private final FlashcardMapper flashcardMapper;
    private final PracticeSetMapper practiceSetMapper;

    @Transactional(readOnly = true)
    public UserRoadmapResponse getActiveRoadmap(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        UserLearningPath activePath = getActivePath(user.getId());

        List<LearningPathMilestone> milestones = learningPathMilestoneRepository
                .findByLearningPathIdOrderBySortOrderAsc(activePath.getLearningPath().getId());

        List<MilestoneModule> allMilestoneModules = milestones.stream()
                .flatMap(milestone -> milestoneModuleRepository
                        .findByMilestoneIdOrderBySortOrderAsc(milestone.getId())
                        .stream())
                .toList();

        List<Long> moduleIds = allMilestoneModules.stream()
                .map(entry -> entry.getModule().getId())
                .distinct()
                .toList();

        Map<Long, UserModuleProgress> progressMap = moduleIds.isEmpty()
                ? Collections.emptyMap()
                : userModuleProgressRepository.findByUserIdAndModuleIdIn(user.getId(), moduleIds)
                .stream()
                .collect(Collectors.toMap(progress -> progress.getModule().getId(), Function.identity()));

        Map<Long, Long> videoCountMap = new HashMap<>();
        Map<Long, Long> flashcardCountMap = new HashMap<>();
        Map<Long, Long> practiceSetCountMap = new HashMap<>();
        for (Long moduleId : moduleIds) {
            videoCountMap.put(moduleId, videoLessonRepository.countByModuleIdAndPublishedTrue(moduleId));
            flashcardCountMap.put(moduleId, flashcardRepository.countByModuleIdAndActiveTrue(moduleId));
            practiceSetCountMap.put(moduleId, practiceSetRepository.countByModuleIdAndPublishedTrue(moduleId));
        }

        UserRoadmapResponse response = new UserRoadmapResponse();
        response.setAssignmentId(activePath.getId());
        response.setLearningPathId(activePath.getLearningPath().getId());
        response.setLearningPathCode(activePath.getLearningPath().getCode());
        response.setLearningPathTitle(activePath.getLearningPath().getTitle());
        response.setLearningPathDescription(activePath.getLearningPath().getDescription());
        response.setTargetScore(activePath.getLearningPath().getTargetScore());
        response.setStatus(activePath.getStatus().name());
        response.setAssignedAt(activePath.getAssignedAt());

        List<UserRoadmapResponse.MilestoneItem> milestoneItems = milestones.stream()
                .map(milestone -> toMilestoneItem(
                        milestone,
                        progressMap,
                        videoCountMap,
                        flashcardCountMap,
                        practiceSetCountMap))
                .toList();
        response.setMilestones(milestoneItems);

        List<UserRoadmapResponse.ModuleItem> orderedModules = milestoneItems.stream()
                .flatMap(item -> item.getModules().stream())
                .toList();

        double total = orderedModules.stream()
                .mapToDouble(UserRoadmapResponse.ModuleItem::getProgressPercent)
                .average()
                .orElse(0.0);
        response.setProgressPercent(total);

        Long currentModuleId = orderedModules.stream()
                .filter(item -> ProgressStatus.IN_PROGRESS.name().equals(item.getProgressStatus()))
                .map(UserRoadmapResponse.ModuleItem::getModuleId)
                .findFirst()
                .orElseGet(() -> orderedModules.stream()
                        .filter(item -> ProgressStatus.NOT_STARTED.name().equals(item.getProgressStatus()))
                        .map(UserRoadmapResponse.ModuleItem::getModuleId)
                        .findFirst()
                        .orElseGet(() -> orderedModules.stream()
                                .map(UserRoadmapResponse.ModuleItem::getModuleId)
                                .findFirst()
                                .orElse(null)));
        response.setCurrentModuleId(currentModuleId);

        return response;
    }

    @Transactional(readOnly = true)
    public UserModuleContentResponse getModuleContent(String email, Long moduleId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        UserLearningPath activePath = getActivePath(user.getId());
        List<LearningPathMilestone> milestones = learningPathMilestoneRepository
                .findByLearningPathIdOrderBySortOrderAsc(activePath.getLearningPath().getId());

        Set<Long> allowedModuleIds = milestones.stream()
                .flatMap(milestone -> milestoneModuleRepository
                        .findByMilestoneIdOrderBySortOrderAsc(milestone.getId())
                        .stream())
                .map(entry -> entry.getModule().getId())
                .collect(Collectors.toSet());
        if (!allowedModuleIds.contains(moduleId)) {
            throw new AppException(ErrorCode.LEARNING_MODULE_NOT_FOUND);
        }

        LearningModule module = learningModuleRepository.findById(moduleId)
                .orElseThrow(() -> new AppException(ErrorCode.LEARNING_MODULE_NOT_FOUND));

        UserModuleContentResponse response = new UserModuleContentResponse();
        response.setModuleId(module.getId());
        response.setTitle(module.getTitle());
        response.setDescription(module.getDescription());
        response.setModuleType(module.getModuleType());
        response.setEstimatedMinutes(module.getEstimatedMinutes());
        response.setDifficultyLevel(module.getDifficultyLevel());

        response.setVideoLessons(userLessonService.getLessonsForUser(email, moduleId));

        List<FlashcardResponse> flashcards = flashcardMapper.toResponseList(
                flashcardRepository.findAllByModuleIdAndActiveTrueOrderByCreatedAtDesc(moduleId)
        );
        response.setFlashcards(flashcards);

        List<PracticeSetResponse> practiceSets = practiceSetMapper.toResponseList(
                practiceSetRepository.findByModuleIdAndPublishedTrueOrderByCreatedAtDesc(moduleId)
        );
        response.setPracticeSets(practiceSets);

        return response;
    }

    private UserLearningPath getActivePath(Long userId) {
        return userLearningPathRepository
                .findTopByUserIdAndStatusOrderByAssignedAtDesc(userId, PathStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.LEARNING_PATH_NOT_FOUND));
    }

    private UserRoadmapResponse.MilestoneItem toMilestoneItem(
            LearningPathMilestone milestone,
            Map<Long, UserModuleProgress> progressMap,
            Map<Long, Long> videoCountMap,
            Map<Long, Long> flashcardCountMap,
            Map<Long, Long> practiceSetCountMap
    ) {
        UserRoadmapResponse.MilestoneItem item = new UserRoadmapResponse.MilestoneItem();
        item.setId(milestone.getId());
        item.setTitle(milestone.getTitle());
        item.setDescription(milestone.getDescription());
        item.setSortOrder(milestone.getSortOrder());

        List<UserRoadmapResponse.ModuleItem> modules = milestoneModuleRepository
                .findByMilestoneIdOrderBySortOrderAsc(milestone.getId())
                .stream()
                .map(link -> toModuleItem(
                        link,
                        progressMap.get(link.getModule().getId()),
                        videoCountMap,
                        flashcardCountMap,
                        practiceSetCountMap))
                .toList();
        item.setModules(modules);
        return item;
    }

    private UserRoadmapResponse.ModuleItem toModuleItem(
            MilestoneModule milestoneModule,
            UserModuleProgress progress,
            Map<Long, Long> videoCountMap,
            Map<Long, Long> flashcardCountMap,
            Map<Long, Long> practiceSetCountMap
    ) {
        LearningModule module = milestoneModule.getModule();
        Long moduleId = module.getId();

        UserRoadmapResponse.ModuleItem item = new UserRoadmapResponse.ModuleItem();
        item.setModuleId(moduleId);
        item.setTitle(module.getTitle());
        item.setDescription(module.getDescription());
        item.setModuleType(module.getModuleType());
        item.setEstimatedMinutes(module.getEstimatedMinutes());
        item.setDifficultyLevel(module.getDifficultyLevel());
        item.setSortOrder(milestoneModule.getSortOrder());
        item.setRequired(milestoneModule.getRequired());
        item.setUnlockCondition(milestoneModule.getUnlockCondition());
        item.setProgressStatus(progress == null || progress.getStatus() == null
                ? ProgressStatus.NOT_STARTED.name()
                : progress.getStatus().name());
        item.setProgressPercent(progress == null || progress.getProgressPercent() == null
                ? 0.0
                : progress.getProgressPercent());
        item.setVideoLessonCount(videoCountMap.getOrDefault(moduleId, 0L));
        item.setFlashcardCount(flashcardCountMap.getOrDefault(moduleId, 0L));
        item.setPracticeSetCount(practiceSetCountMap.getOrDefault(moduleId, 0L));
        return item;
    }
}
