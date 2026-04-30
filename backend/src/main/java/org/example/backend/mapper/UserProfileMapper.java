package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.UserProfile;
import org.example.backend.dto.response.UserProfileResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface UserProfileMapper {
    @Mapping(target = "userId", source = "user.id")
    UserProfileResponse toResponse(UserProfile entity);
    List<UserProfileResponse> toResponseList(List<UserProfile> entities);
}
