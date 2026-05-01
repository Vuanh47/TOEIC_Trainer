package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.UserPracticeAnswer;
import org.example.backend.dto.response.UserPracticeAnswerResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface UserPracticeAnswerMapper {
    @Mapping(target = "attemptId", source = "attempt.id")
    @Mapping(target = "questionId", source = "question.id")
    @Mapping(target = "selectedOptionId", source = "selectedOption.id")
    UserPracticeAnswerResponse toResponse(UserPracticeAnswer entity);
    List<UserPracticeAnswerResponse> toResponseList(List<UserPracticeAnswer> entities);
}
