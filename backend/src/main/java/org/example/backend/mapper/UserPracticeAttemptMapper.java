package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.UserPracticeAttempt;
import org.example.backend.dto.response.UserPracticeAttemptResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface UserPracticeAttemptMapper {
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "practiceSetId", source = "practiceSet.id")
    @Mapping(target = "practiceSetTitle", source = "practiceSet.title")
    @Mapping(target = "moduleId", source = "practiceSet.module.id")
    @Mapping(target = "moduleTitle", source = "practiceSet.module.title")
    UserPracticeAttemptResponse toResponse(UserPracticeAttempt entity);
    List<UserPracticeAttemptResponse> toResponseList(List<UserPracticeAttempt> entities);
}
