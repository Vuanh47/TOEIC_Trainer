package org.example.backend.mapper;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.response.TestPartResponse;
import org.example.backend.entity.TestPart;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TestPartMapper {

    private final TestPartQuestionMapper testPartQuestionMapper;

    public TestPartResponse toResponse(TestPart entity) {
        if (entity == null) {
            return null;
        }
        TestPartResponse response = new TestPartResponse();
        response.setId(entity.getId());
        response.setPartName(entity.getPartName());
        response.setPartNumber(entity.getPartNumber());
        response.setPartSection(entity.getPartSection());
        response.setDescription(entity.getDescription());
        response.setSortOrder(entity.getSortOrder());
        response.setDurationMinutes(entity.getDurationMinutes());
        response.setQuestionCount(entity.getQuestions() == null ? 0 : entity.getQuestions().size());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());
        if (entity.getQuestions() != null) {
            response.setQuestions(entity.getQuestions().stream()
                    .map(testPartQuestionMapper::toResponse)
                    .collect(Collectors.toList()));
        }
        return response;
    }

    public List<TestPartResponse> toResponseList(List<TestPart> entities) {
        if (entities == null) {
            return List.of();
        }
        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}

