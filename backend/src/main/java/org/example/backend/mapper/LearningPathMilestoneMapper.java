package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.LearningPathMilestone;
import org.example.backend.dto.response.LearningPathMilestoneResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface LearningPathMilestoneMapper {
    @Mapping(target = "learningPathId", source = "learningPath.id")
    LearningPathMilestoneResponse toResponse(LearningPathMilestone entity);
    List<LearningPathMilestoneResponse> toResponseList(List<LearningPathMilestone> entities);
}
