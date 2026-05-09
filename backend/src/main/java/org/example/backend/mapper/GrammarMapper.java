package org.example.backend.mapper;

import org.example.backend.dto.response.GrammarResponse;
import org.example.backend.entity.Grammar;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface GrammarMapper {
    GrammarResponse toResponse(Grammar entity);

    List<GrammarResponse> toResponseList(List<Grammar> entities);
}
