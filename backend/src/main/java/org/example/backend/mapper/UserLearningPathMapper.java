package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.UserLearningPath;
import org.example.backend.dto.response.UserLearningPathResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface UserLearningPathMapper {
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "learningPathId", source = "learningPath.id")
    UserLearningPathResponse toResponse(UserLearningPath entity);
    List<UserLearningPathResponse> toResponseList(List<UserLearningPath> entities);
}
