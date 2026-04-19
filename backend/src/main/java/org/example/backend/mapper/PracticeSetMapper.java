package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.PracticeSet;
import org.example.backend.dto.response.PracticeSetResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface PracticeSetMapper {
    @Mapping(target = "moduleId", source = "module.id")
    PracticeSetResponse toResponse(PracticeSet entity);
    List<PracticeSetResponse> toResponseList(List<PracticeSet> entities);
}
