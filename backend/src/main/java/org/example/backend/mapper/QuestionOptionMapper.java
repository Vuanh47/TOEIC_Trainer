package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.QuestionOption;
import org.example.backend.dto.response.QuestionOptionResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface QuestionOptionMapper {
    @Mapping(target = "questionId", source = "question.id")
    QuestionOptionResponse toResponse(QuestionOption entity);
    List<QuestionOptionResponse> toResponseList(List<QuestionOption> entities);
}
