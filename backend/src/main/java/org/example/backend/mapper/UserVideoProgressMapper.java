package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.UserVideoProgress;
import org.example.backend.dto.response.UserVideoProgressResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface UserVideoProgressMapper {
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "lessonId", source = "lesson.id")
    UserVideoProgressResponse toResponse(UserVideoProgress entity);
    List<UserVideoProgressResponse> toResponseList(List<UserVideoProgress> entities);
}
