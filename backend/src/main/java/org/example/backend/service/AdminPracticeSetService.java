package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.AssignPracticeSetQuestionItemRequest;
import org.example.backend.dto.request.AssignPracticeSetQuestionsRequest;
import org.example.backend.dto.request.CreatePracticeSetRequest;
import org.example.backend.dto.request.UpdatePracticeSetRequest;
import org.example.backend.dto.response.PracticeSetQuestionDetailResponse;
import org.example.backend.dto.response.PracticeSetResponse;
import org.example.backend.entity.LearningModule;
import org.example.backend.entity.PracticeSet;
import org.example.backend.entity.PracticeSetQuestion;
import org.example.backend.entity.Question;
import org.example.backend.enums.ErrorCode;
import org.example.backend.enums.PracticeSetType;
import org.example.backend.exception.AppException;
import org.example.backend.mapper.PracticeSetQuestionMapper;
import org.example.backend.mapper.PracticeSetMapper;
import org.example.backend.repository.LearningModuleRepository;
import org.example.backend.repository.PracticeSetQuestionRepository;
import org.example.backend.repository.PracticeSetRepository;
import org.example.backend.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminPracticeSetService {

    private final PracticeSetRepository practiceSetRepository;
    private final LearningModuleRepository learningModuleRepository;
    private final QuestionRepository questionRepository;
    private final PracticeSetQuestionRepository practiceSetQuestionRepository;
    private final PracticeSetMapper practiceSetMapper;
    private final PracticeSetQuestionMapper practiceSetQuestionMapper;

    @Transactional
    public PracticeSetResponse createPracticeSet(CreatePracticeSetRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_PRACTICE_SET_DATA);
        }

        String title = trimToNull(request.getTitle());
        if (title == null || request.getModuleId() == null) {
            throw new AppException(ErrorCode.INVALID_PRACTICE_SET_DATA);
        }

        PracticeSet practiceSet = new PracticeSet();
        practiceSet.setModule(findModule(request.getModuleId()));
        practiceSet.setTitle(title);
        practiceSet.setDescription(trimToNull(request.getDescription()));
        practiceSet.setPartNo(request.getPartNo());
        practiceSet.setTargetScore(request.getTargetScore());
        practiceSet.setSetType(request.getSetType() == null ? PracticeSetType.PRACTICE : request.getSetType());
        practiceSet.setDurationMinutes(request.getDurationMinutes() == null ? 20 : request.getDurationMinutes());
        practiceSet.setPublished(request.getPublished() == null ? false : request.getPublished());

        if (!isValidDuration(practiceSet.getDurationMinutes())) {
            throw new AppException(ErrorCode.INVALID_PRACTICE_SET_DATA);
        }

        return practiceSetMapper.toResponse(practiceSetRepository.save(practiceSet));
    }

    @Transactional(readOnly = true)
    public List<PracticeSetResponse> getPracticeSetsByModule(Long moduleId) {
        ensureModuleExists(moduleId);
        return practiceSetMapper.toResponseList(practiceSetRepository.findByModuleIdOrderByCreatedAtDesc(moduleId));
    }

    @Transactional
    public PracticeSetResponse updatePracticeSet(Long practiceSetId, UpdatePracticeSetRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_PRACTICE_SET_DATA);
        }

        PracticeSet practiceSet = findPracticeSet(practiceSetId);

        if (request.getModuleId() != null) {
            practiceSet.setModule(findModule(request.getModuleId()));
        }

        if (request.getTitle() != null) {
            String title = trimToNull(request.getTitle());
            if (title == null) {
                throw new AppException(ErrorCode.INVALID_PRACTICE_SET_DATA);
            }
            practiceSet.setTitle(title);
        }

        if (request.getDescription() != null) {
            practiceSet.setDescription(trimToNull(request.getDescription()));
        }

        if (request.getPartNo() != null) {
            practiceSet.setPartNo(request.getPartNo());
        }

        if (request.getTargetScore() != null) {
            practiceSet.setTargetScore(request.getTargetScore());
        }

        if (request.getSetType() != null) {
            practiceSet.setSetType(request.getSetType());
        }

        if (request.getDurationMinutes() != null) {
            if (!isValidDuration(request.getDurationMinutes())) {
                throw new AppException(ErrorCode.INVALID_PRACTICE_SET_DATA);
            }
            practiceSet.setDurationMinutes(request.getDurationMinutes());
        }

        if (request.getPublished() != null) {
            practiceSet.setPublished(request.getPublished());
        }

        return practiceSetMapper.toResponse(practiceSetRepository.save(practiceSet));
    }

    @Transactional
    public void deletePracticeSet(Long practiceSetId) {
        PracticeSet practiceSet = findPracticeSet(practiceSetId);
        practiceSetQuestionRepository.deleteByPracticeSetId(practiceSetId);
        practiceSetRepository.delete(practiceSet);
    }

    @Transactional
    public List<PracticeSetQuestionDetailResponse> assignQuestionsToPracticeSet(
            Long practiceSetId,
            AssignPracticeSetQuestionsRequest request
    ) {
        PracticeSet practiceSet = findPracticeSet(practiceSetId);
        if (request == null || request.getQuestions() == null || request.getQuestions().isEmpty()) {
            throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
        }

        List<PracticeSetQuestion> entities = new ArrayList<>();
        Set<Long> seenQuestionIds = new HashSet<>();
        Set<Integer> seenSortOrders = new HashSet<>();

        for (AssignPracticeSetQuestionItemRequest item : request.getQuestions()) {
            if (item == null || item.getQuestionId() == null || item.getSortOrder() == null || item.getSortOrder() <= 0) {
                throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
            }
            if (!seenQuestionIds.add(item.getQuestionId()) || !seenSortOrders.add(item.getSortOrder())) {
                throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
            }

            Question question = findQuestion(item.getQuestionId());
            PracticeSetQuestion mapping = new PracticeSetQuestion();
            mapping.setPracticeSet(practiceSet);
            mapping.setQuestion(question);
            mapping.setSortOrder(item.getSortOrder());
            entities.add(mapping);
        }

        practiceSetQuestionRepository.deleteByPracticeSetId(practiceSetId);
        List<PracticeSetQuestion> saved = practiceSetQuestionRepository.saveAll(entities);
        return practiceSetQuestionMapper.toDetailResponseList(saved);
    }

    @Transactional(readOnly = true)
    public List<PracticeSetQuestionDetailResponse> getPracticeSetQuestions(Long practiceSetId) {
        findPracticeSet(practiceSetId);
        List<PracticeSetQuestion> entities = practiceSetQuestionRepository.findByPracticeSetIdOrderBySortOrderAsc(practiceSetId);
        return practiceSetQuestionMapper.toDetailResponseList(entities);
    }

    private PracticeSet findPracticeSet(Long practiceSetId) {
        return practiceSetRepository.findById(practiceSetId)
                .orElseThrow(() -> new AppException(ErrorCode.PRACTICE_SET_NOT_FOUND));
    }

    private LearningModule findModule(Long moduleId) {
        return learningModuleRepository.findById(moduleId)
                .orElseThrow(() -> new AppException(ErrorCode.LEARNING_MODULE_NOT_FOUND));
    }

    private Question findQuestion(Long questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new AppException(ErrorCode.QUESTION_NOT_FOUND));
    }

    private void ensureModuleExists(Long moduleId) {
        if (moduleId == null || !learningModuleRepository.existsById(moduleId)) {
            throw new AppException(ErrorCode.LEARNING_MODULE_NOT_FOUND);
        }
    }

    private boolean isValidDuration(Integer durationMinutes) {
        return durationMinutes != null && durationMinutes > 0;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}

