package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.response.FavoriteGrammarTitleResponse;
import org.example.backend.dto.response.UserGrammarResponse;
import org.example.backend.entity.Grammar;
import org.example.backend.entity.User;
import org.example.backend.entity.UserFavoriteGrammar;
import org.example.backend.enums.ErrorCode;
import org.example.backend.exception.AppException;
import org.example.backend.repository.GrammarRepository;
import org.example.backend.repository.UserFavoriteGrammarRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserGrammarService {

    private final GrammarRepository grammarRepository;
    private final UserRepository userRepository;
    private final UserFavoriteGrammarRepository userFavoriteGrammarRepository;

    @Transactional(readOnly = true)
    public List<UserGrammarResponse> getActiveGrammars(String email) {
        User user = findByEmail(email);
        List<Grammar> grammars = grammarRepository.findAllByOrderByCreatedAtDesc();
        Set<Long> favoriteIds = userFavoriteGrammarRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(ufg -> ufg.getGrammar().getId())
                .collect(Collectors.toSet());

        return grammars.stream()
                .filter(g -> Boolean.TRUE.equals(g.getActive()))
                .map(g -> toUserGrammarResponse(g, favoriteIds.contains(g.getId())))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserGrammarResponse getGrammarById(String email, Long grammarId) {
        User user = findByEmail(email);
        Grammar grammar = findGrammar(grammarId);

        if (!Boolean.TRUE.equals(grammar.getActive())) {
            throw new AppException(ErrorCode.GRAMMAR_NOT_FOUND);
        }

        boolean isFavorite = userFavoriteGrammarRepository.existsByUserIdAndGrammarId(user.getId(), grammarId);
        return toUserGrammarResponse(grammar, isFavorite);
    }

    @Transactional
    public void addFavorite(String email, Long grammarId) {
        User user = findByEmail(email);
        Grammar grammar = findGrammar(grammarId);

        if (!Boolean.TRUE.equals(grammar.getActive())) {
            throw new AppException(ErrorCode.GRAMMAR_NOT_FOUND);
        }

        if (userFavoriteGrammarRepository.existsByUserIdAndGrammarId(user.getId(), grammarId)) {
            throw new AppException(ErrorCode.GRAMMAR_ALREADY_FAVORITED);
        }

        UserFavoriteGrammar favorite = new UserFavoriteGrammar();
        favorite.setUser(user);
        favorite.setGrammar(grammar);
        userFavoriteGrammarRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(String email, Long grammarId) {
        User user = findByEmail(email);
        findGrammar(grammarId);

        if (!userFavoriteGrammarRepository.existsByUserIdAndGrammarId(user.getId(), grammarId)) {
            throw new AppException(ErrorCode.GRAMMAR_NOT_FAVORITED);
        }

        userFavoriteGrammarRepository.deleteByUserIdAndGrammarId(user.getId(), grammarId);
    }

    @Transactional(readOnly = true)
    public List<UserGrammarResponse> getFavoriteGrammars(String email) {
        User user = findByEmail(email);
        List<UserFavoriteGrammar> favorites = userFavoriteGrammarRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        return favorites.stream()
                .map(ufg -> toUserGrammarResponse(ufg.getGrammar(), true))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FavoriteGrammarTitleResponse> getFavoriteTitles(String email) {
        User user = findByEmail(email);
        List<UserFavoriteGrammar> favorites = userFavoriteGrammarRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        return favorites.stream()
                .map(ufg -> {
                    FavoriteGrammarTitleResponse response = new FavoriteGrammarTitleResponse();
                    response.setId(ufg.getGrammar().getId());
                    response.setTitle(ufg.getGrammar().getTitle());
                    response.setSavedAt(ufg.getCreatedAt());
                    return response;
                })
                .collect(Collectors.toList());
    }

    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private Grammar findGrammar(Long id) {
        return grammarRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.GRAMMAR_NOT_FOUND));
    }

    private UserGrammarResponse toUserGrammarResponse(Grammar grammar, boolean isFavorite) {
        UserGrammarResponse response = new UserGrammarResponse();
        response.setId(grammar.getId());
        response.setTitle(grammar.getTitle());
        response.setContent(grammar.getContent());
        response.setTips(grammar.getTips());
        response.setExample(grammar.getExample());
        response.setActive(grammar.getActive());
        response.setIsFavorite(isFavorite);
        response.setCreatedAt(grammar.getCreatedAt());
        response.setUpdatedAt(grammar.getUpdatedAt());
        return response;
    }
}

