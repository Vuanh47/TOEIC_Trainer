package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateVideoLessonRequest;
import org.example.backend.dto.request.UpdateVideoLessonRequest;
import org.example.backend.dto.response.VideoLessonResponse;
import org.example.backend.entity.Course;
import org.example.backend.entity.LearningModule;
import org.example.backend.entity.VideoLesson;
import org.example.backend.enums.ErrorCode;
import org.example.backend.exception.AppException;
import org.example.backend.mapper.VideoLessonMapper;
import org.example.backend.repository.CourseRepository;
import org.example.backend.repository.LearningModuleRepository;
import org.example.backend.repository.VideoLessonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminVideoLessonService {

    private final VideoLessonRepository videoLessonRepository;
    private final LearningModuleRepository learningModuleRepository;
    private final CourseRepository courseRepository;
    private final VideoLessonMapper videoLessonMapper;

    @Transactional
    public VideoLessonResponse createVideoLesson(CreateVideoLessonRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_VIDEO_LESSON_DATA);
        }

        LearningModule module = findModule(request.getModuleId());
        String title = trimToNull(request.getTitle());
        String videoUrl = trimToNull(request.getVideoUrl());

        if (title == null || videoUrl == null || !isValidPositive(request.getDurationSeconds()) || !isValidSortOrder(request.getSortOrder())) {
            throw new AppException(ErrorCode.INVALID_VIDEO_LESSON_DATA);
        }

        VideoLesson videoLesson = new VideoLesson();
        videoLesson.setCourse(resolveCourse(request.getCourseId()));
        videoLesson.setModule(module);
        videoLesson.setTitle(title);
        videoLesson.setDescription(trimToNull(request.getDescription()));
        videoLesson.setVideoUrl(videoUrl);
        videoLesson.setDurationSeconds(request.getDurationSeconds());
        videoLesson.setSortOrder(request.getSortOrder());
        videoLesson.setFree(request.getFree() == null ? false : request.getFree());
        videoLesson.setPublished(request.getPublished() == null ? false : request.getPublished());

        return videoLessonMapper.toResponse(videoLessonRepository.save(videoLesson));
    }

    @Transactional(readOnly = true)
    public List<VideoLessonResponse> getVideoLessonsByModule(Long moduleId) {
        ensureModuleExists(moduleId);
        return videoLessonMapper.toResponseList(videoLessonRepository.findByModuleIdOrderBySortOrderAsc(moduleId));
    }

    @Transactional
    public VideoLessonResponse updateVideoLesson(Long videoLessonId, UpdateVideoLessonRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_VIDEO_LESSON_DATA);
        }

        VideoLesson videoLesson = findVideoLesson(videoLessonId);

        if (request.getCourseId() != null) {
            videoLesson.setCourse(resolveCourse(request.getCourseId()));
        }

        if (request.getModuleId() != null) {
            videoLesson.setModule(findModule(request.getModuleId()));
        }

        if (request.getTitle() != null) {
            String title = trimToNull(request.getTitle());
            if (title == null) {
                throw new AppException(ErrorCode.INVALID_VIDEO_LESSON_DATA);
            }
            videoLesson.setTitle(title);
        }

        if (request.getDescription() != null) {
            videoLesson.setDescription(trimToNull(request.getDescription()));
        }

        if (request.getVideoUrl() != null) {
            String videoUrl = trimToNull(request.getVideoUrl());
            if (videoUrl == null) {
                throw new AppException(ErrorCode.INVALID_VIDEO_LESSON_DATA);
            }
            videoLesson.setVideoUrl(videoUrl);
        }

        if (request.getDurationSeconds() != null) {
            if (!isValidPositive(request.getDurationSeconds())) {
                throw new AppException(ErrorCode.INVALID_VIDEO_LESSON_DATA);
            }
            videoLesson.setDurationSeconds(request.getDurationSeconds());
        }

        if (request.getSortOrder() != null) {
            if (!isValidSortOrder(request.getSortOrder())) {
                throw new AppException(ErrorCode.INVALID_VIDEO_LESSON_DATA);
            }
            videoLesson.setSortOrder(request.getSortOrder());
        }

        if (request.getFree() != null) {
            videoLesson.setFree(request.getFree());
        }

        if (request.getPublished() != null) {
            videoLesson.setPublished(request.getPublished());
        }

        return videoLessonMapper.toResponse(videoLessonRepository.save(videoLesson));
    }

    @Transactional
    public void deleteVideoLesson(Long videoLessonId) {
        VideoLesson videoLesson = findVideoLesson(videoLessonId);
        videoLessonRepository.delete(videoLesson);
    }

    private VideoLesson findVideoLesson(Long videoLessonId) {
        return videoLessonRepository.findById(videoLessonId)
                .orElseThrow(() -> new AppException(ErrorCode.VIDEO_LESSON_NOT_FOUND));
    }

    private LearningModule findModule(Long moduleId) {
        if (moduleId == null) {
            throw new AppException(ErrorCode.INVALID_VIDEO_LESSON_DATA);
        }
        return learningModuleRepository.findById(moduleId)
                .orElseThrow(() -> new AppException(ErrorCode.LEARNING_MODULE_NOT_FOUND));
    }

    private void ensureModuleExists(Long moduleId) {
        if (moduleId == null || !learningModuleRepository.existsById(moduleId)) {
            throw new AppException(ErrorCode.LEARNING_MODULE_NOT_FOUND);
        }
    }

    private Course resolveCourse(Long courseId) {
        if (courseId == null) {
            return null;
        }
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_VIDEO_LESSON_DATA));
    }

    private boolean isValidPositive(Integer value) {
        return value != null && value > 0;
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

