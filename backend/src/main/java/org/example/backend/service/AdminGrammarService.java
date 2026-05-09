package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateGrammarRequest;
import org.example.backend.dto.request.UpdateGrammarRequest;
import org.example.backend.dto.response.GrammarResponse;
import org.example.backend.entity.Grammar;
import org.example.backend.enums.ErrorCode;
import org.example.backend.exception.AppException;
import org.example.backend.mapper.GrammarMapper;
import org.example.backend.repository.GrammarRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminGrammarService {

    private final GrammarRepository grammarRepository;
    private final GrammarMapper grammarMapper;

    @Transactional(readOnly = true)
    public List<GrammarResponse> getAllGrammars() {
        return grammarMapper.toResponseList(grammarRepository.findAllByOrderByCreatedAtDesc());
    }

    @Transactional(readOnly = true)
    public GrammarResponse getGrammarById(Long id) {
        return grammarMapper.toResponse(findGrammar(id));
    }

    @Transactional
    public GrammarResponse createGrammar(CreateGrammarRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_GRAMMAR_DATA);
        }

        String title = trimToNull(request.getTitle());
        String content = trimToNull(request.getContent());
        if (title == null || content == null) {
            throw new AppException(ErrorCode.INVALID_GRAMMAR_DATA);
        }

        if (grammarRepository.existsByTitleIgnoreCase(title)) {
            throw new AppException(ErrorCode.GRAMMAR_TITLE_EXISTED);
        }

        Grammar grammar = new Grammar();
        grammar.setTitle(title);
        grammar.setContent(content);
        grammar.setTips(trimToNull(request.getTips()));
        grammar.setExample(trimToNull(request.getExample()));
        grammar.setActive(request.getActive() == null ? true : request.getActive());

        return grammarMapper.toResponse(grammarRepository.save(grammar));
    }

    @Transactional
    public GrammarResponse updateGrammar(Long id, UpdateGrammarRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_GRAMMAR_DATA);
        }

        Grammar grammar = findGrammar(id);

        if (request.getTitle() != null) {
            String title = trimToNull(request.getTitle());
            if (title == null) {
                throw new AppException(ErrorCode.INVALID_GRAMMAR_DATA);
            }
            if (!grammar.getTitle().equalsIgnoreCase(title) && grammarRepository.existsByTitleIgnoreCase(title)) {
                throw new AppException(ErrorCode.GRAMMAR_TITLE_EXISTED);
            }
            grammar.setTitle(title);
        }

        if (request.getContent() != null) {
            String content = trimToNull(request.getContent());
            if (content == null) {
                throw new AppException(ErrorCode.INVALID_GRAMMAR_DATA);
            }
            grammar.setContent(content);
        }

        if (request.getTips() != null) {
            grammar.setTips(trimToNull(request.getTips()));
        }

        if (request.getExample() != null) {
            grammar.setExample(trimToNull(request.getExample()));
        }

        if (request.getActive() != null) {
            grammar.setActive(request.getActive());
        }

        return grammarMapper.toResponse(grammarRepository.save(grammar));
    }

    @Transactional
    public void deleteGrammar(Long id) {
        Grammar grammar = findGrammar(id);
        grammarRepository.delete(grammar);
    }

    private Grammar findGrammar(Long id) {
        return grammarRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.GRAMMAR_NOT_FOUND));
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
