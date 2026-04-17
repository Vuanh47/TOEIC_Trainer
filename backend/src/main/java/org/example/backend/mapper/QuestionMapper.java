package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.Question;
import org.example.backend.dto.response.QuestionResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface QuestionMapper {
    QuestionResponse toResponse(Question entity);
    List<QuestionResponse> toResponseList(List<Question> entities);
}
