package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CompleteModuleRequest;
import org.example.backend.dto.request.UpdateLessonProgressRequest;
import org.example.backend.dto.response.LessonProgressUpdateResponse;
import org.example.backend.dto.response.ModuleUnlockResponse;
import org.example.backend.entity.LearningModule;
import org.example.backend.entity.LearningPathMilestone;
import org.example.backend.entity.MilestoneModule;
import org.example.backend.entity.User;
import org.example.backend.entity.UserLearningPath;
import org.example.backend.entity.UserModuleProgress;
import org.example.backend.entity.UserVideoProgress;
import org.example.backend.entity.VideoLesson;
import org.example.backend.enums.ErrorCode;
import org.example.backend.enums.PathStatus;
import org.example.backend.enums.ProgressStatus;
import org.example.backend.exception.AppException;
import org.example.backend.repository.LearningPathMilestoneRepository;
import org.example.backend.repository.LearningModuleRepository;
import org.example.backend.repository.MilestoneModuleRepository;
import org.example.backend.repository.UserLearningPathRepository;
import org.example.backend.repository.UserModuleProgressRepository;
import org.example.backend.repository.UserRepository;
import org.example.backend.repository.UserVideoProgressRepository;
import org.example.backend.repository.VideoLessonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserProgressService {

    private static final double LESSON_COMPLETED_THRESHOLD = 90.0;
    private static final double MODULE_COMPLETED_THRESHOLD = 90.0;

    private final UserRepository userRepository;
    private final UserLearningPathRepository userLearningPathRepository;
    private final LearningPathMilestoneRepository learningPathMilestoneRepository;
    private final MilestoneModuleRepository milestoneModuleRepository;
    private final LearningModuleRepository learningModuleRepository;
    private final VideoLessonRepository videoLessonRepository;
    private final UserVideoProgressRepository userVideoProgressRepository;
    private final UserModuleProgressRepository userModuleProgressRepository;

    @Transactional
    public LessonProgressUpdateResponse updateLessonProgress(
            String email,
            Long lessonId,
            UpdateLessonProgressRequest request
    ) {
        User user = findUser(email);
        UserLearningPath activePath = getActivePath(user.getId());
        VideoLesson lesson = findPublishedLesson(lessonId);
        LearningModule module = validateLessonBelongsToActivePath(activePath, lesson);

        UserVideoProgress videoProgress = userVideoProgressRepository
                .findByUserIdAndLessonId(user.getId(), lessonId)
                .orElseGet(() -> buildInitialVideoProgress(user, lesson));

        applyVideoProgressUpdate(videoProgress, lesson, request);
        userVideoProgressRepository.save(videoProgress);

        UserModuleProgress moduleProgress = recalculateModuleProgress(user, module);

        List<MilestoneModule> orderedModules = getOrderedModules(activePath.getLearningPath().getId());
        UnlockResult unlockResult = unlockNextModuleIfNeeded(user, activePath, orderedModules, module.getId(), moduleProgress);

        LessonProgressUpdateResponse response = new LessonProgressUpdateResponse();
        response.setLessonId(lesson.getId());
        response.setModuleId(module.getId());
        response.setLessonStatus(videoProgress.getStatus().name());
        response.setLessonCompletionPercent(videoProgress.getCompletionPercent());
        response.setLastPositionSeconds(videoProgress.getLastPositionSeconds());
        response.setWatchedSeconds(videoProgress.getWatchedSeconds());
        response.setModuleStatus(moduleProgress.getStatus().name());
        response.setModuleProgressPercent(moduleProgress.getProgressPercent());
        response.setNextModuleId(unlockResult.nextModuleId());
        response.setNextModuleUnlocked(unlockResult.nextModuleUnlocked());
        response.setPathCompleted(unlockResult.pathCompleted());
        return response;
    }

    @Transactional
    public ModuleUnlockResponse completeOrUnlockNextModule(
            String email,
            Long moduleId,
            CompleteModuleRequest request
    ) {
        User user = findUser(email);
        UserLearningPath activePath = getActivePath(user.getId());
        LearningModule module = validateModuleBelongsToActivePath(activePath, moduleId);
        UserModuleProgress moduleProgress = recalculateModuleProgress(user, module);

        boolean forceComplete = request != null && Boolean.TRUE.equals(request.getForceComplete());
        if (forceComplete && moduleProgress.getStatus() != ProgressStatus.COMPLETED) {
            forceCompleteModuleProgress(moduleProgress);
            moduleProgress = userModuleProgressRepository.save(moduleProgress);
        }

        List<MilestoneModule> orderedModules = getOrderedModules(activePath.getLearningPath().getId());
        UnlockResult unlockResult = unlockNextModuleIfNeeded(user, activePath, orderedModules, module.getId(), moduleProgress);

        ModuleUnlockResponse response = new ModuleUnlockResponse();
        response.setModuleId(moduleId);
        response.setModuleStatus(moduleProgress.getStatus().name());
        response.setModuleProgressPercent(moduleProgress.getProgressPercent());
        response.setModuleCompleted(moduleProgress.getStatus() == ProgressStatus.COMPLETED);
        response.setNextModuleId(unlockResult.nextModuleId());
        response.setNextModuleUnlocked(unlockResult.nextModuleUnlocked());
        response.setPathCompleted(unlockResult.pathCompleted());
        return response;
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private UserLearningPath getActivePath(Long userId) {
        return userLearningPathRepository
                .findTopByUserIdAndStatusOrderByAssignedAtDesc(userId, PathStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.LEARNING_PATH_NOT_FOUND));
    }

    private VideoLesson findPublishedLesson(Long lessonId) {
        VideoLesson lesson = videoLessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(ErrorCode.VIDEO_LESSON_NOT_FOUND));
        if (!Boolean.TRUE.equals(lesson.getPublished())) {
            throw new AppException(ErrorCode.VIDEO_LESSON_NOT_FOUND);
        }
        return lesson;
    }

    private LearningModule validateLessonBelongsToActivePath(UserLearningPath activePath, VideoLesson lesson) {
        LearningModule module = lesson.getModule();
        if (module == null) {
            throw new AppException(ErrorCode.LEARNING_MODULE_NOT_FOUND);
        }

        Set<Long> allowedModuleIds = getAllowedModuleIds(activePath.getLearningPath().getId());
        if (!allowedModuleIds.contains(module.getId())) {
            throw new AppException(ErrorCode.LEARNING_MODULE_NOT_FOUND);
        }

        return module;
    }

    private LearningModule validateModuleBelongsToActivePath(UserLearningPath activePath, Long moduleId) {
        if (moduleId == null) {
            throw new AppException(ErrorCode.LEARNING_MODULE_NOT_FOUND);
        }

        Set<Long> allowedModuleIds = getAllowedModuleIds(activePath.getLearningPath().getId());
        if (!allowedModuleIds.contains(moduleId)) {
            throw new AppException(ErrorCode.LEARNING_MODULE_NOT_FOUND);
        }

        return learningModuleRepository.findById(moduleId)
                .orElseThrow(() -> new AppException(ErrorCode.LEARNING_MODULE_NOT_FOUND));
    }

    private Set<Long> getAllowedModuleIds(Long learningPathId) {
        return getOrderedModules(learningPathId).stream()
                .map(link -> link.getModule().getId())
                .collect(Collectors.toSet());
    }

    private List<MilestoneModule> getOrderedModules(Long learningPathId) {
        List<LearningPathMilestone> milestones = learningPathMilestoneRepository
                .findByLearningPathIdOrderBySortOrderAsc(learningPathId);
        return milestones.stream()
                .flatMap(milestone -> milestoneModuleRepository
                        .findByMilestoneIdOrderBySortOrderAsc(milestone.getId())
                        .stream())
                .toList();
    }

    private UserVideoProgress buildInitialVideoProgress(User user, VideoLesson lesson) {
        UserVideoProgress progress = new UserVideoProgress();
        progress.setUser(user);
        progress.setLesson(lesson);
        progress.setLastPositionSeconds(0);
        progress.setWatchedSeconds(0);
        progress.setCompletionPercent(0.0);
        progress.setStatus(ProgressStatus.NOT_STARTED);
        return progress;
    }

    private void applyVideoProgressUpdate(
            UserVideoProgress progress,
            VideoLesson lesson,
            UpdateLessonProgressRequest request
    ) {
        UpdateLessonProgressRequest payload = request == null ? new UpdateLessonProgressRequest() : request;
        LocalDateTime now = LocalDateTime.now();
        int durationSeconds = Math.max(1, lesson.getDurationSeconds() == null ? 1 : lesson.getDurationSeconds());

        Integer nextLastPosition = payload.getLastPositionSeconds() != null
                ? payload.getLastPositionSeconds()
                : defaultInteger(progress.getLastPositionSeconds());
        Integer nextWatchedSeconds = payload.getWatchedSeconds() != null
                ? payload.getWatchedSeconds()
                : Math.max(defaultInteger(progress.getWatchedSeconds()), nextLastPosition);
        Double nextCompletionPercent = payload.getCompletionPercent() != null
                ? payload.getCompletionPercent()
                : defaultDouble(progress.getCompletionPercent());

        if (nextLastPosition < 0 || nextWatchedSeconds < 0) {
            throw new AppException(ErrorCode.INVALID_PROGRESS_DATA);
        }
        if (payload.getCompletionPercent() != null && (payload.getCompletionPercent() < 0 || payload.getCompletionPercent() > 100)) {
            throw new AppException(ErrorCode.INVALID_PROGRESS_DATA);
        }

        if (nextLastPosition > durationSeconds) {
            nextLastPosition = durationSeconds;
        }

        double fromPosition = (nextLastPosition * 100.0) / durationSeconds;
        double fromWatched = (nextWatchedSeconds * 100.0) / durationSeconds;
        nextCompletionPercent = Math.max(nextCompletionPercent, fromPosition);
        nextCompletionPercent = Math.max(nextCompletionPercent, Math.min(100.0, fromWatched));

        ProgressStatus requestedStatus = parseRequestedStatus(payload.getStatus());
        if (requestedStatus == ProgressStatus.COMPLETED) {
            nextCompletionPercent = 100.0;
        }
        if (requestedStatus == ProgressStatus.NOT_STARTED && nextLastPosition == 0 && nextWatchedSeconds == 0) {
            nextCompletionPercent = 0.0;
        }

        nextCompletionPercent = Math.min(100.0, Math.max(0.0, nextCompletionPercent));

        ProgressStatus computedStatus;
        if (nextCompletionPercent >= LESSON_COMPLETED_THRESHOLD) {
            computedStatus = ProgressStatus.COMPLETED;
        } else if (nextCompletionPercent > 0 || nextLastPosition > 0 || nextWatchedSeconds > 0 || requestedStatus == ProgressStatus.IN_PROGRESS) {
            computedStatus = ProgressStatus.IN_PROGRESS;
        } else {
            computedStatus = ProgressStatus.NOT_STARTED;
        }

        progress.setLastPositionSeconds(nextLastPosition);
        progress.setWatchedSeconds(nextWatchedSeconds);
        progress.setCompletionPercent(nextCompletionPercent);
        progress.setStatus(computedStatus);
        progress.setLastWatchedAt(now);
        if (computedStatus == ProgressStatus.COMPLETED) {
            if (progress.getCompletedAt() == null) {
                progress.setCompletedAt(now);
            }
        } else {
            progress.setCompletedAt(null);
        }
    }

    private ProgressStatus parseRequestedStatus(String rawStatus) {
        if (rawStatus == null || rawStatus.isBlank()) {
            return null;
        }
        try {
            return ProgressStatus.valueOf(rawStatus.trim().toUpperCase());
        } catch (IllegalArgumentException ignored) {
            throw new AppException(ErrorCode.INVALID_PROGRESS_DATA);
        }
    }

    private UserModuleProgress recalculateModuleProgress(User user, LearningModule module) {
        Long moduleId = module.getId();
        if (moduleId == null) {
            throw new AppException(ErrorCode.LEARNING_MODULE_NOT_FOUND);
        }

        List<VideoLesson> lessons = videoLessonRepository.findByModuleIdAndPublishedTrueOrderBySortOrderAsc(moduleId);
        List<Long> lessonIds = lessons.stream().map(VideoLesson::getId).toList();

        Map<Long, UserVideoProgress> lessonProgressMap = lessonIds.isEmpty()
                ? Collections.emptyMap()
                : userVideoProgressRepository.findByUserIdAndLessonIdIn(user.getId(), lessonIds)
                .stream()
                .collect(Collectors.toMap(item -> item.getLesson().getId(), item -> item));

        double progressPercent = 0.0;
        int completedCount = 0;
        if (!lessons.isEmpty()) {
            double total = 0.0;
            for (VideoLesson lesson : lessons) {
                UserVideoProgress lessonProgress = lessonProgressMap.get(lesson.getId());
                double completion = lessonProgress == null ? 0.0 : defaultDouble(lessonProgress.getCompletionPercent());
                total += completion;
                if (lessonProgress != null && lessonProgress.getStatus() == ProgressStatus.COMPLETED) {
                    completedCount++;
                }
            }
            progressPercent = total / lessons.size();
        }

        ProgressStatus moduleStatus;
        if (!lessons.isEmpty() && (completedCount == lessons.size() || progressPercent >= MODULE_COMPLETED_THRESHOLD)) {
            moduleStatus = ProgressStatus.COMPLETED;
            progressPercent = 100.0;
        } else if (progressPercent > 0.0) {
            moduleStatus = ProgressStatus.IN_PROGRESS;
        } else {
            moduleStatus = ProgressStatus.NOT_STARTED;
        }

        UserModuleProgress moduleProgress = userModuleProgressRepository
                .findByUserIdAndModuleId(user.getId(), moduleId)
                .orElseGet(() -> buildInitialModuleProgress(user, module));

        LocalDateTime now = LocalDateTime.now();
        moduleProgress.setProgressPercent(progressPercent);
        moduleProgress.setStatus(moduleStatus);
        moduleProgress.setLastAccessedAt(now);
        if (moduleStatus != ProgressStatus.NOT_STARTED && moduleProgress.getStartedAt() == null) {
            moduleProgress.setStartedAt(now);
        }
        if (moduleStatus == ProgressStatus.COMPLETED) {
            if (moduleProgress.getCompletedAt() == null) {
                moduleProgress.setCompletedAt(now);
            }
        } else {
            moduleProgress.setCompletedAt(null);
        }
        return userModuleProgressRepository.save(moduleProgress);
    }

    private UserModuleProgress buildInitialModuleProgress(User user, LearningModule module) {
        UserModuleProgress progress = new UserModuleProgress();
        progress.setUser(user);
        progress.setModule(module);
        progress.setStatus(ProgressStatus.NOT_STARTED);
        progress.setProgressPercent(0.0);
        return progress;
    }

    private void forceCompleteModuleProgress(UserModuleProgress moduleProgress) {
        LocalDateTime now = LocalDateTime.now();
        moduleProgress.setStatus(ProgressStatus.COMPLETED);
        moduleProgress.setProgressPercent(100.0);
        moduleProgress.setLastAccessedAt(now);
        if (moduleProgress.getStartedAt() == null) {
            moduleProgress.setStartedAt(now);
        }
        if (moduleProgress.getCompletedAt() == null) {
            moduleProgress.setCompletedAt(now);
        }
    }

    private UnlockResult unlockNextModuleIfNeeded(
            User user,
            UserLearningPath activePath,
            List<MilestoneModule> orderedModules,
            Long currentModuleId,
            UserModuleProgress currentModuleProgress
    ) {
        if (currentModuleProgress.getStatus() != ProgressStatus.COMPLETED) {
            return new UnlockResult(null, false, false);
        }

        Map<Long, Integer> moduleOrder = new HashMap<>();
        for (int i = 0; i < orderedModules.size(); i++) {
            moduleOrder.put(orderedModules.get(i).getModule().getId(), i);
        }
        Integer currentIndex = moduleOrder.get(currentModuleId);
        if (currentIndex == null) {
            return new UnlockResult(null, false, false);
        }

        for (int index = currentIndex + 1; index < orderedModules.size(); index++) {
            LearningModule nextModule = orderedModules.get(index).getModule();
            Optional<UserModuleProgress> existing = userModuleProgressRepository
                    .findByUserIdAndModuleId(user.getId(), nextModule.getId());
            UserModuleProgress progress = existing.orElseGet(() -> buildInitialModuleProgress(user, nextModule));

            if (progress.getStatus() == ProgressStatus.COMPLETED) {
                continue;
            }

            boolean unlockedNow = false;
            if (progress.getStatus() == ProgressStatus.NOT_STARTED) {
                progress.setStatus(ProgressStatus.IN_PROGRESS);
                progress.setProgressPercent(defaultDouble(progress.getProgressPercent()));
                unlockedNow = true;
            }
            LocalDateTime now = LocalDateTime.now();
            if (progress.getStartedAt() == null) {
                progress.setStartedAt(now);
            }
            progress.setLastAccessedAt(now);
            userModuleProgressRepository.save(progress);

            return new UnlockResult(nextModule.getId(), unlockedNow, false);
        }

        boolean allCompleted = areAllModulesCompleted(user.getId(), orderedModules);
        if (allCompleted) {
            activePath.setStatus(PathStatus.COMPLETED);
            if (activePath.getCompletedAt() == null) {
                activePath.setCompletedAt(LocalDateTime.now());
            }
            userLearningPathRepository.save(activePath);
        }
        return new UnlockResult(null, false, allCompleted);
    }

    private boolean areAllModulesCompleted(Long userId, List<MilestoneModule> orderedModules) {
        List<Long> moduleIds = orderedModules.stream()
                .map(link -> link.getModule().getId())
                .distinct()
                .toList();
        if (moduleIds.isEmpty()) {
            return true;
        }

        Map<Long, UserModuleProgress> progressMap = userModuleProgressRepository
                .findByUserIdAndModuleIdIn(userId, moduleIds)
                .stream()
                .collect(Collectors.toMap(progress -> progress.getModule().getId(), progress -> progress));

        for (Long moduleId : moduleIds) {
            UserModuleProgress progress = progressMap.get(moduleId);
            if (progress == null || progress.getStatus() != ProgressStatus.COMPLETED) {
                return false;
            }
        }
        return true;
    }

    private int defaultInteger(Integer value) {
        return value == null ? 0 : value;
    }

    private double defaultDouble(Double value) {
        return value == null ? 0.0 : value;
    }

    private record UnlockResult(Long nextModuleId, Boolean nextModuleUnlocked, Boolean pathCompleted) {
    }
}
