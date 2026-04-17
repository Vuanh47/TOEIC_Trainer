package org.example.backend.mapper;

import org.example.backend.dto.response.FlashcardResponse;
import org.example.backend.entity.Flashcard;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FlashcardMapper {

    @Mapping(target = "ownerId", source = "owner.id")
    @Mapping(target = "moduleId", source = "module.id")
    @Mapping(target = "personalCard", expression = "java(entity.getOwner() != null)")
    FlashcardResponse toResponse(Flashcard entity);

    List<FlashcardResponse> toResponseList(List<Flashcard> entities);
}

