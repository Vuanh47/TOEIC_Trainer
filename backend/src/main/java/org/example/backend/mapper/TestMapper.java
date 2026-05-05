package org.example.backend.mapper;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.response.TestResponse;
import org.example.backend.entity.Test;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TestMapper {

    private final TestPartMapper testPartMapper;

    public TestResponse toResponse(Test entity) {
        if (entity == null) {
            return null;
        }
        TestResponse response = new TestResponse();
        response.setId(entity.getId());
        response.setTitle(entity.getTitle());
        response.setDescription(entity.getDescription());
        response.setTestType(entity.getTestType());
        response.setTotalDurationMinutes(entity.getTotalDurationMinutes());
        response.setTargetScore(entity.getTargetScore());
        response.setPublished(entity.getPublished());
        response.setPartCount(entity.getParts() == null ? 0 : entity.getParts().size());
        response.setQuestionCount(entity.getParts() == null ? 0 : 
            entity.getParts().stream().mapToInt(p -> p.getQuestions() == null ? 0 : p.getQuestions().size()).sum());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());
        if (entity.getParts() != null) {
            response.setParts(entity.getParts().stream()
                    .map(testPartMapper::toResponse)
                    .collect(Collectors.toList()));
        }
        return response;
    }

    public List<TestResponse> toResponseList(List<Test> entities) {
        if (entities == null) {
            return List.of();
        }
        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}

