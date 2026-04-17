package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.VocabularyTopic;
import org.example.backend.dto.response.VocabularyTopicResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface VocabularyTopicMapper {
    VocabularyTopicResponse toResponse(VocabularyTopic entity);
    List<VocabularyTopicResponse> toResponseList(List<VocabularyTopic> entities);
}
