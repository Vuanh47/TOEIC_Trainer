package org.example.backend.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.example.backend.entity.Course;
import org.example.backend.dto.response.CourseResponse;
import java.util.List;
@Mapper(componentModel = "spring")
public interface CourseMapper {
    CourseResponse toResponse(Course entity);
    List<CourseResponse> toResponseList(List<Course> entities);
}
