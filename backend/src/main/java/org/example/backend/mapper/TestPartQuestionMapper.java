package org.example.backend.mapper;

import org.example.backend.dto.response.TestPartQuestionResponse;
import org.example.backend.entity.TestPartQuestion;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TestPartQuestionMapper {

    public TestPartQuestionResponse toResponse(TestPartQuestion entity) {
        if (entity == null) {
            return null;
        }
        TestPartQuestionResponse response = new TestPartQuestionResponse();
        response.setId(entity.getId());
        response.setQuestionId(entity.getQuestion() != null ? entity.getQuestion().getId() : null);
        response.setSortOrder(entity.getSortOrder());
        response.setQuestionText(entity.getQuestion() != null ? entity.getQuestion().getQuestionText() : null);
        response.setPartNo(entity.getQuestion() != null ? entity.getQuestion().getPartNo() : null);
        response.setDifficultyLevel(entity.getQuestion() != null ? entity.getQuestion().getDifficultyLevel() : null);
        return response;
    }

    public List<TestPartQuestionResponse> toResponseList(List<TestPartQuestion> entities) {
        if (entities == null) {
            return List.of();
        }
        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}

