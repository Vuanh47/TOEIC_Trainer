package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.LearningPath;
import org.example.backend.dto.response.LearningPathResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface LearningPathMapper {
    LearningPathResponse toResponse(LearningPath entity);
    List<LearningPathResponse> toResponseList(List<LearningPath> entities);
}
