package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateQuestionOptionRequest;
import org.example.backend.dto.request.CreateQuestionRequest;
import org.example.backend.dto.request.UpdateQuestionRequest;
import org.example.backend.dto.response.QuestionResponse;
import org.example.backend.entity.Question;
import org.example.backend.entity.QuestionOption;
import org.example.backend.enums.ErrorCode;
import org.example.backend.enums.QuestionSourceType;
import org.example.backend.exception.AppException;
import org.example.backend.mapper.QuestionMapper;
import org.example.backend.repository.PracticeSetQuestionRepository;
import org.example.backend.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminQuestionBankService {

    private static final Set<String> REQUIRED_LABELS = Set.of("A", "B", "C", "D");

    private final QuestionRepository questionRepository;
    private final PracticeSetQuestionRepository practiceSetQuestionRepository;
    private final QuestionMapper questionMapper;

    @Transactional
    public QuestionResponse createQuestion(CreateQuestionRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
        }

        Question question = new Question();
        applyQuestionFields(question, request.getPartNo(), request.getQuestionText(), request.getExplanation(),
                request.getDifficultyLevel(), request.getSourceType(), request.getSourceYear());
        question.setOptions(buildValidatedOptions(question, request.getOptions()));

        return questionMapper.toResponse(questionRepository.save(question));
    }

    @Transactional(readOnly = true)
    public List<QuestionResponse> getQuestions(String keyword) {
        String normalized = trimToNull(keyword);
        List<Question> questions;
        if (normalized == null) {
            questions = questionRepository.findAllByOrderByCreatedAtDesc();
        } else {
            questions = questionRepository.findByQuestionTextContainingIgnoreCaseOrderByCreatedAtDesc(normalized);
        }
        return questionMapper.toResponseList(questions);
    }

    @Transactional(readOnly = true)
    public QuestionResponse getQuestionById(Long questionId) {
        return questionMapper.toResponse(findQuestion(questionId));
    }

    @Transactional
    public QuestionResponse updateQuestion(Long questionId, UpdateQuestionRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
        }

        Question question = findQuestion(questionId);

        if (request.getPartNo() != null) {
            if (request.getPartNo() <= 0) {
                throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
            }
            question.setPartNo(request.getPartNo());
        }

        if (request.getQuestionText() != null) {
            String questionText = trimToNull(request.getQuestionText());
            if (questionText == null) {
                throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
            }
            question.setQuestionText(questionText);
        }

        if (request.getExplanation() != null) {
            question.setExplanation(trimToNull(request.getExplanation()));
        }

        if (request.getDifficultyLevel() != null) {
            question.setDifficultyLevel(trimToNull(request.getDifficultyLevel()));
        }

        if (request.getSourceType() != null) {
            question.setSourceType(request.getSourceType());
        }

        if (request.getSourceYear() != null) {
            question.setSourceYear(request.getSourceYear());
        }

        if (request.getOptions() != null) {
            List<QuestionOption> refreshedOptions = buildValidatedOptions(question, request.getOptions());
            question.getOptions().clear();
            question.getOptions().addAll(refreshedOptions);
        }

        return questionMapper.toResponse(questionRepository.save(question));
    }

    @Transactional
    public void deleteQuestion(Long questionId) {
        Question question = findQuestion(questionId);
        practiceSetQuestionRepository.deleteByQuestionId(questionId);
        questionRepository.delete(question);
    }

    private Question findQuestion(Long questionId) {
        if (questionId == null) {
            throw new AppException(ErrorCode.QUESTION_NOT_FOUND);
        }
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new AppException(ErrorCode.QUESTION_NOT_FOUND));
    }

    private void applyQuestionFields(
            Question question,
            Integer partNo,
            String questionText,
            String explanation,
            String difficultyLevel,
            QuestionSourceType sourceType,
            Integer sourceYear
    ) {
        String normalizedQuestionText = trimToNull(questionText);
        if (partNo == null || partNo <= 0 || normalizedQuestionText == null) {
            throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
        }

        question.setPartNo(partNo);
        question.setQuestionText(normalizedQuestionText);
        question.setExplanation(trimToNull(explanation));
        question.setDifficultyLevel(trimToNull(difficultyLevel));
        question.setSourceType(sourceType);
        question.setSourceYear(sourceYear);
    }

    private List<QuestionOption> buildValidatedOptions(Question question, List<CreateQuestionOptionRequest> options) {
        if (options == null || options.size() != 4) {
            throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
        }

        List<QuestionOption> entities = new ArrayList<>();
        Set<String> seenLabels = new HashSet<>();
        int correctCount = 0;

        for (CreateQuestionOptionRequest optionRequest : options) {
            if (optionRequest == null) {
                throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
            }

            String optionLabel = normalizeLabel(optionRequest.getOptionLabel());
            String optionText = trimToNull(optionRequest.getOptionText());
            boolean correct = optionRequest.getCorrect() != null && optionRequest.getCorrect();

            if (!REQUIRED_LABELS.contains(optionLabel) || optionText == null || !seenLabels.add(optionLabel)) {
                throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
            }

            if (correct) {
                correctCount++;
            }

            QuestionOption option = new QuestionOption();
            option.setQuestion(question);
            option.setOptionLabel(optionLabel);
            option.setOptionText(optionText);
            option.setCorrect(correct);
            entities.add(option);
        }

        if (!seenLabels.equals(REQUIRED_LABELS) || correctCount != 1) {
            throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
        }

        return entities;
    }

    private String normalizeLabel(String value) {
        String trimmed = trimToNull(value);
        if (trimmed == null) {
            return null;
        }
        return trimmed.toUpperCase(Locale.ROOT);
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
