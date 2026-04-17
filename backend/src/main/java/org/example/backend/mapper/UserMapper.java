package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.User;
import org.example.backend.dto.response.UserResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "profileId", source = "profile.id")
    UserResponse toResponse(User entity);
    List<UserResponse> toResponseList(List<User> entities);
}
