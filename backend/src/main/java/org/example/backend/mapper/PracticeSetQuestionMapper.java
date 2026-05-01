package org.example.backend.mapper;

import org.example.backend.dto.response.PracticeSetQuestionDetailResponse;
import org.example.backend.dto.response.PracticeSetQuestionResponse;
import org.example.backend.entity.PracticeSetQuestion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {QuestionMapper.class})
public interface PracticeSetQuestionMapper {
    @Mapping(target = "practiceSetId", source = "practiceSet.id")
    @Mapping(target = "questionId", source = "question.id")
    PracticeSetQuestionResponse toResponse(PracticeSetQuestion entity);

    List<PracticeSetQuestionResponse> toResponseList(List<PracticeSetQuestion> entities);

    @Mapping(target = "practiceSetId", source = "practiceSet.id")
    @Mapping(target = "questionId", source = "question.id")
    @Mapping(target = "question", source = "question")
    PracticeSetQuestionDetailResponse toDetailResponse(PracticeSetQuestion entity);

    List<PracticeSetQuestionDetailResponse> toDetailResponseList(List<PracticeSetQuestion> entities);
}
