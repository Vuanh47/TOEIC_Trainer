package org.example.backend.mapper;

import org.example.backend.dto.response.UserLessonResponse;
import org.example.backend.entity.UserVideoProgress;
import org.example.backend.entity.VideoLesson;
import org.example.backend.enums.ProgressStatus;
import org.springframework.stereotype.Component;

@Component
public class UserLessonMapper {

    public UserLessonResponse toResponse(VideoLesson lesson, UserVideoProgress progress) {
        UserLessonResponse response = new UserLessonResponse();
        response.setLessonId(lesson.getId());
        response.setModuleId(lesson.getModule() != null ? lesson.getModule().getId() : null);
        response.setModuleTitle(lesson.getModule() != null ? lesson.getModule().getTitle() : null);
        response.setLessonTitle(lesson.getTitle());
        response.setLessonDescription(lesson.getDescription());
        response.setVideoUrl(lesson.getVideoUrl());
        response.setDurationSeconds(lesson.getDurationSeconds());
        response.setSortOrder(lesson.getSortOrder());
        response.setFree(lesson.getFree());

        if (progress == null) {
            response.setCompletionPercent(0.0);
            response.setLastPositionSeconds(0);
            response.setProgressStatus(ProgressStatus.NOT_STARTED.name());
            return response;
        }

        response.setCompletionPercent(progress.getCompletionPercent() == null ? 0.0 : progress.getCompletionPercent());
        response.setLastPositionSeconds(progress.getLastPositionSeconds() == null ? 0 : progress.getLastPositionSeconds());
        response.setProgressStatus(progress.getStatus() == null ? ProgressStatus.NOT_STARTED.name() : progress.getStatus().name());
        return response;
    }
}

