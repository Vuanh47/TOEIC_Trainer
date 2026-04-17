package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.UserModuleProgress;
import org.example.backend.dto.response.UserModuleProgressResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface UserModuleProgressMapper {
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "moduleId", source = "module.id")
    UserModuleProgressResponse toResponse(UserModuleProgress entity);
    List<UserModuleProgressResponse> toResponseList(List<UserModuleProgress> entities);
}
