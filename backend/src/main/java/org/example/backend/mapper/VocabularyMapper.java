package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.Vocabulary;
import org.example.backend.dto.response.VocabularyResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface VocabularyMapper {
    @Mapping(target = "topicId", source = "topic.id")
    VocabularyResponse toResponse(Vocabulary entity);
    List<VocabularyResponse> toResponseList(List<Vocabulary> entities);
}
