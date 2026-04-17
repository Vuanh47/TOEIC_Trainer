package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.VideoNote;
import org.example.backend.dto.response.VideoNoteResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface VideoNoteMapper {
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "lessonId", source = "lesson.id")
    VideoNoteResponse toResponse(VideoNote entity);
    List<VideoNoteResponse> toResponseList(List<VideoNote> entities);
}
