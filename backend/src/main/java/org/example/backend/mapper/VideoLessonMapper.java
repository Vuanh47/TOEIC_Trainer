package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.VideoLesson;
import org.example.backend.dto.response.VideoLessonResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface VideoLessonMapper {
    @Mapping(target = "moduleId", source = "module.id")
    VideoLessonResponse toResponse(VideoLesson entity);
    List<VideoLessonResponse> toResponseList(List<VideoLesson> entities);
}
