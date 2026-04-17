package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.MilestoneModule;
import org.example.backend.dto.response.MilestoneModuleResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface MilestoneModuleMapper {
    @Mapping(target = "milestoneId", source = "milestone.id")
    @Mapping(target = "moduleId", source = "module.id")
    MilestoneModuleResponse toResponse(MilestoneModule entity);
    List<MilestoneModuleResponse> toResponseList(List<MilestoneModule> entities);
}
