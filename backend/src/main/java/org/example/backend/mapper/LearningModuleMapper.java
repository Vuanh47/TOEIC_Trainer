package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.LearningModule;
import org.example.backend.dto.response.LearningModuleResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface LearningModuleMapper {
    LearningModuleResponse toResponse(LearningModule entity);
    List<LearningModuleResponse> toResponseList(List<LearningModule> entities);
}
