package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.PracticeSetQuestion;
import org.example.backend.dto.response.PracticeSetQuestionResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface PracticeSetQuestionMapper {
    @Mapping(target = "practiceSetId", source = "practiceSet.id")
    @Mapping(target = "questionId", source = "question.id")
    PracticeSetQuestionResponse toResponse(PracticeSetQuestion entity);
    List<PracticeSetQuestionResponse> toResponseList(List<PracticeSetQuestion> entities);
}
