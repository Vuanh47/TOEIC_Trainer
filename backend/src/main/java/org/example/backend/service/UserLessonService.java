package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.response.UserLessonResponse;
import org.example.backend.entity.User;
import org.example.backend.entity.UserVideoProgress;
import org.example.backend.entity.VideoLesson;
import org.example.backend.enums.ErrorCode;
import org.example.backend.mapper.UserLessonMapper;
import org.example.backend.exception.AppException;
import org.example.backend.repository.UserRepository;
import org.example.backend.repository.UserVideoProgressRepository;
import org.example.backend.repository.VideoLessonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserLessonService {

    private final UserRepository userRepository;
    private final VideoLessonRepository videoLessonRepository;
    private final UserVideoProgressRepository userVideoProgressRepository;
    private final UserLessonMapper userLessonMapper;

    @Transactional(readOnly = true)
    public List<UserLessonResponse> getLessonsForUser(String email, Long moduleId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        List<VideoLesson> lessons = moduleId == null
                ? videoLessonRepository.findPublishedLessonsForUser()
                : videoLessonRepository.findByModuleIdAndPublishedTrueOrderBySortOrderAsc(moduleId);

        if (lessons.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> lessonIds = lessons.stream()
                .map(VideoLesson::getId)
                .toList();

        Map<Long, UserVideoProgress> progressByLessonId = userVideoProgressRepository
                .findByUserIdAndLessonIdIn(user.getId(), lessonIds)
                .stream()
                .collect(Collectors.toMap(progress -> progress.getLesson().getId(), Function.identity()));

        return lessons.stream()
                .map(lesson -> userLessonMapper.toResponse(lesson, progressByLessonId.get(lesson.getId())))
                .toList();
    }

}
