package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.UserVocabularyProgress;
import org.example.backend.dto.response.UserVocabularyProgressResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface UserVocabularyProgressMapper {
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "vocabularyId", source = "vocabulary.id")
    UserVocabularyProgressResponse toResponse(UserVocabularyProgress entity);
    List<UserVocabularyProgressResponse> toResponseList(List<UserVocabularyProgress> entities);
}
