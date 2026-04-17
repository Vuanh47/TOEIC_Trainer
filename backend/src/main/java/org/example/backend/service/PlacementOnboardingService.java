package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.response.UserLearningPathResponse;
import org.example.backend.entity.LearningPath;
import org.example.backend.entity.User;
import org.example.backend.entity.UserLearningPath;
import org.example.backend.entity.UserPracticeAttempt;
import org.example.backend.enums.AttemptStatus;
import org.example.backend.enums.ErrorCode;
import org.example.backend.enums.PathStatus;
import org.example.backend.enums.PracticeSetType;
import org.example.backend.exception.AppException;
import org.example.backend.mapper.UserLearningPathMapper;
import org.example.backend.repository.LearningPathRepository;
import org.example.backend.repository.UserLearningPathRepository;
import org.example.backend.repository.UserPracticeAttemptRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlacementOnboardingService {

    private final UserRepository userRepository;
    private final UserPracticeAttemptRepository userPracticeAttemptRepository;
    private final LearningPathRepository learningPathRepository;
    private final UserLearningPathRepository userLearningPathRepository;
    private final UserLearningPathMapper userLearningPathMapper;

    @Transactional
    public UserLearningPathResponse assignRecommendedLearningPath(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Integer recommendedTargetScore = resolveRecommendedTargetScore(user);
        LearningPath learningPath = selectLearningPath(recommendedTargetScore);

        archiveActivePaths(user.getId());

        UserLearningPath assignment = new UserLearningPath();
        assignment.setUser(user);
        assignment.setLearningPath(learningPath);
        assignment.setSource("PLACEMENT_ONBOARDING");
        assignment.setStatus(PathStatus.ACTIVE);

        UserLearningPath saved = userLearningPathRepository.save(assignment);
        return userLearningPathMapper.toResponse(saved);
    }

    private Integer resolveRecommendedTargetScore(User user) {
        Integer userTarget = Optional.ofNullable(user.getTargetScore()).orElse(300);

        Optional<UserPracticeAttempt> latestPlacementAttempt =
                userPracticeAttemptRepository.findTopByUserIdAndPracticeSetSetTypeAndStatusOrderBySubmittedAtDesc(
                        user.getId(),
                        PracticeSetType.PLACEMENT,
                        AttemptStatus.SUBMITTED
                );

        if (latestPlacementAttempt.isEmpty() || latestPlacementAttempt.get().getScore() == null) {
            return userTarget;
        }

        int placementScore = (int) Math.round(latestPlacementAttempt.get().getScore());
        return Math.max(userTarget, placementScore);
    }

    private LearningPath selectLearningPath(Integer targetScore) {
        return learningPathRepository.findFirstByActiveTrueAndTargetScoreGreaterThanEqualOrderByTargetScoreAsc(targetScore)
                .or(() -> learningPathRepository.findFirstByActiveTrueOrderByTargetScoreDesc())
                .orElseThrow(() -> new AppException(ErrorCode.LEARNING_PATH_NOT_FOUND));
    }

    private void archiveActivePaths(Long userId) {
        List<UserLearningPath> activePaths = userLearningPathRepository.findByUserIdAndStatus(userId, PathStatus.ACTIVE);
        LocalDateTime now = LocalDateTime.now();
        for (UserLearningPath activePath : activePaths) {
            activePath.setStatus(PathStatus.ARCHIVED);
            activePath.setCompletedAt(now);
        }
    }
}

