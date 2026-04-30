package org.example.backend.mapper;

import org.example.backend.dto.response.QuestionResponse;
import org.example.backend.entity.Question;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {QuestionOptionMapper.class})
public interface QuestionMapper {
    QuestionResponse toResponse(Question entity);
    List<QuestionResponse> toResponseList(List<Question> entities);
}
