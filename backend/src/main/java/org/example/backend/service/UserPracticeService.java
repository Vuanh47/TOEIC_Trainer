package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.SubmitPracticeAttemptRequest;
import org.example.backend.dto.response.PracticeSetResponse;
import org.example.backend.dto.response.UserPracticeAttemptDetailResponse;
import org.example.backend.dto.response.UserPracticeAttemptResponse;
import org.example.backend.dto.response.UserPracticeSetDetailResponse;
import org.example.backend.entity.LearningModule;
import org.example.backend.entity.PracticeSet;
import org.example.backend.entity.PracticeSetQuestion;
import org.example.backend.entity.Question;
import org.example.backend.entity.QuestionOption;
import org.example.backend.entity.User;
import org.example.backend.entity.UserPracticeAnswer;
import org.example.backend.entity.UserPracticeAttempt;
import org.example.backend.enums.AttemptStatus;
import org.example.backend.enums.ErrorCode;
import org.example.backend.exception.AppException;
import org.example.backend.mapper.PracticeSetMapper;
import org.example.backend.repository.LearningModuleRepository;
import org.example.backend.repository.PracticeSetQuestionRepository;
import org.example.backend.repository.PracticeSetRepository;
import org.example.backend.repository.UserPracticeAnswerRepository;
import org.example.backend.repository.UserPracticeAttemptRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserPracticeService {

    private final PracticeSetRepository practiceSetRepository;
    private final PracticeSetQuestionRepository practiceSetQuestionRepository;
    private final UserPracticeAttemptRepository userPracticeAttemptRepository;
    private final UserPracticeAnswerRepository userPracticeAnswerRepository;
    private final UserRepository userRepository;
    private final LearningModuleRepository learningModuleRepository;
    private final PracticeSetMapper practiceSetMapper;

    @Transactional(readOnly = true)
    public List<PracticeSetResponse> getPracticeSetsByModule(Long moduleId) {
        ensureModuleExists(moduleId);
        return practiceSetMapper.toResponseList(practiceSetRepository.findByModuleIdAndPublishedTrueOrderByCreatedAtDesc(moduleId));
    }

    @Transactional(readOnly = true)
    public UserPracticeSetDetailResponse getPracticeSetDetail(Long practiceSetId) {
        PracticeSet practiceSet = findPublishedPracticeSet(practiceSetId);
        return buildPracticeSetDetail(practiceSet);
    }

    @Transactional
    public UserPracticeAttemptResponse startPractice(String email, Long practiceSetId) {
        User user = findUser(email);
        PracticeSet practiceSet = findPublishedPracticeSet(practiceSetId);

        return userPracticeAttemptRepository
                .findByUserIdAndPracticeSetIdAndStatus(user.getId(), practiceSetId, AttemptStatus.IN_PROGRESS)
                .map(this::toAttemptSummary)
                .orElseGet(() -> {
                    UserPracticeAttempt attempt = new UserPracticeAttempt();
                    attempt.setUser(user);
                    attempt.setPracticeSet(practiceSet);
                    attempt.setStartedAt(LocalDateTime.now());
                    attempt.setTotalQuestions(getPracticeQuestions(practiceSetId).size());
                    attempt.setStatus(AttemptStatus.IN_PROGRESS);
                    UserPracticeAttempt saved = userPracticeAttemptRepository.save(attempt);
                    return toAttemptSummary(saved);
                });
    }

    @Transactional
    public UserPracticeAttemptDetailResponse submitPractice(String email, Long attemptId, SubmitPracticeAttemptRequest request) {
        User user = findUser(email);
        if (request == null || request.getAnswers() == null) {
            throw new AppException(ErrorCode.INVALID_PRACTICE_ATTEMPT_DATA);
        }

        UserPracticeAttempt attempt = userPracticeAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new AppException(ErrorCode.PRACTICE_ATTEMPT_NOT_FOUND));

        if (!attempt.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
        if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
            throw new AppException(ErrorCode.INVALID_PRACTICE_ATTEMPT_DATA);
        }

        PracticeSet practiceSet = attempt.getPracticeSet();
        List<PracticeSetQuestion> practiceQuestions = getPracticeQuestions(practiceSet.getId());
        Set<Long> practiceQuestionIds = practiceQuestions.stream().map(PracticeSetQuestion::getId).collect(Collectors.toSet());
        Map<Long, SubmitPracticeAttemptRequest.AnswerSubmission> submissionByPracticeQuestionId = new HashMap<>();
        Set<Long> seenIds = new HashSet<>();
        for (SubmitPracticeAttemptRequest.AnswerSubmission submission : request.getAnswers()) {
            if (submission == null || submission.getPracticeSetQuestionId() == null) {
                throw new AppException(ErrorCode.INVALID_PRACTICE_ATTEMPT_DATA);
            }
            if (!practiceQuestionIds.contains(submission.getPracticeSetQuestionId())) {
                throw new AppException(ErrorCode.INVALID_PRACTICE_ATTEMPT_DATA);
            }
            if (!seenIds.add(submission.getPracticeSetQuestionId())) {
                throw new AppException(ErrorCode.INVALID_PRACTICE_ATTEMPT_DATA);
            }
            submissionByPracticeQuestionId.put(submission.getPracticeSetQuestionId(), submission);
        }

        List<UserPracticeAnswer> answersToSave = new ArrayList<>();
        int correctCount = 0;

        for (PracticeSetQuestion practiceQuestion : practiceQuestions) {
            SubmitPracticeAttemptRequest.AnswerSubmission submission = submissionByPracticeQuestionId.get(practiceQuestion.getId());
            Question question = practiceQuestion.getQuestion();
            QuestionOption selectedOption = null;

            if (submission != null && submission.getSelectedOptionId() != null) {
                selectedOption = question.getOptions().stream()
                        .filter(option -> option.getId().equals(submission.getSelectedOptionId()))
                        .findFirst()
                        .orElseThrow(() -> new AppException(ErrorCode.INVALID_PRACTICE_ATTEMPT_DATA));
            }

            boolean isCorrect = selectedOption != null && Boolean.TRUE.equals(selectedOption.getCorrect());
            if (isCorrect) {
                correctCount++;
            }

            UserPracticeAnswer answer = new UserPracticeAnswer();
            answer.setAttempt(attempt);
            answer.setQuestion(question);
            answer.setSelectedOption(selectedOption);
            answer.setCorrect(isCorrect);
            answer.setAnsweredAt(LocalDateTime.now());
            answer.setAiExplanationRequested(false);
            answersToSave.add(answer);
        }

        userPracticeAnswerRepository.saveAll(answersToSave);

        attempt.setSubmittedAt(LocalDateTime.now());
        attempt.setCorrectCount(correctCount);
        attempt.setTotalQuestions(practiceQuestions.size());
        attempt.setDurationSeconds((int) Math.max(0, Duration.between(attempt.getStartedAt(), attempt.getSubmittedAt()).getSeconds()));
        attempt.setScore(practiceQuestions.isEmpty() ? 0.0 : (correctCount * 100.0) / practiceQuestions.size());
        attempt.setStatus(AttemptStatus.SUBMITTED);
        userPracticeAttemptRepository.save(attempt);

        return buildAttemptDetail(attempt, answersToSave);
    }

    @Transactional(readOnly = true)
    public List<UserPracticeAttemptResponse> getMyPracticeAttempts(String email) {
        User user = findUser(email);
        return userPracticeAttemptRepository.findByUserIdOrderByStartedAtDesc(user.getId())
                .stream()
                .map(this::toAttemptSummary)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserPracticeAttemptDetailResponse getPracticeAttemptDetail(String email, Long attemptId) {
        User user = findUser(email);
        UserPracticeAttempt attempt = userPracticeAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new AppException(ErrorCode.PRACTICE_ATTEMPT_NOT_FOUND));
        if (!attempt.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
        List<UserPracticeAnswer> answers = userPracticeAnswerRepository.findByAttemptIdOrderByIdAsc(attemptId);
        return buildAttemptDetail(attempt, answers);
    }

    private UserPracticeSetDetailResponse buildPracticeSetDetail(PracticeSet practiceSet) {
        UserPracticeSetDetailResponse response = new UserPracticeSetDetailResponse();
        response.setId(practiceSet.getId());
        response.setModuleId(practiceSet.getModule() != null ? practiceSet.getModule().getId() : null);
        response.setModuleTitle(practiceSet.getModule() != null ? practiceSet.getModule().getTitle() : null);
        response.setTitle(practiceSet.getTitle());
        response.setDescription(practiceSet.getDescription());
        response.setPartNo(practiceSet.getPartNo());
        response.setTargetScore(practiceSet.getTargetScore());
        response.setSetType(practiceSet.getSetType());
        response.setDurationMinutes(practiceSet.getDurationMinutes());
        response.setPublished(practiceSet.getPublished());
        response.setQuestionCount(getPracticeQuestions(practiceSet.getId()).size());
        response.setCreatedAt(practiceSet.getCreatedAt());
        response.setUpdatedAt(practiceSet.getUpdatedAt());

        List<PracticeSetQuestion> questions = getPracticeQuestions(practiceSet.getId());
        response.setQuestions(questions.stream().map(this::toQuestionItem).collect(Collectors.toList()));
        return response;
    }

    private UserPracticeSetDetailResponse.QuestionItem toQuestionItem(PracticeSetQuestion practiceQuestion) {
        Question question = practiceQuestion.getQuestion();
        UserPracticeSetDetailResponse.QuestionItem item = new UserPracticeSetDetailResponse.QuestionItem();
        item.setPracticeSetQuestionId(practiceQuestion.getId());
        item.setQuestionId(question.getId());
        item.setSortOrder(practiceQuestion.getSortOrder());
        item.setPartNo(question.getPartNo());
        item.setQuestionText(question.getQuestionText());
        item.setDifficultyLevel(question.getDifficultyLevel());
        item.setSourceType(question.getSourceType() != null ? question.getSourceType().name() : null);
        item.setSourceYear(question.getSourceYear());
        item.setOptions(question.getOptions().stream().map(option -> {
            UserPracticeSetDetailResponse.OptionItem opt = new UserPracticeSetDetailResponse.OptionItem();
            opt.setId(option.getId());
            opt.setOptionLabel(option.getOptionLabel());
            opt.setOptionText(option.getOptionText());
            return opt;
        }).collect(Collectors.toList()));
        return item;
    }

    private UserPracticeAttemptResponse toAttemptSummary(UserPracticeAttempt attempt) {
        UserPracticeAttemptResponse response = new UserPracticeAttemptResponse();
        response.setId(attempt.getId());
        response.setUserId(attempt.getUser() != null ? attempt.getUser().getId() : null);
        response.setPracticeSetId(attempt.getPracticeSet() != null ? attempt.getPracticeSet().getId() : null);
        response.setPracticeSetTitle(attempt.getPracticeSet() != null ? attempt.getPracticeSet().getTitle() : null);
        response.setModuleId(attempt.getPracticeSet() != null && attempt.getPracticeSet().getModule() != null ? attempt.getPracticeSet().getModule().getId() : null);
        response.setModuleTitle(attempt.getPracticeSet() != null && attempt.getPracticeSet().getModule() != null ? attempt.getPracticeSet().getModule().getTitle() : null);
        response.setStartedAt(attempt.getStartedAt());
        response.setSubmittedAt(attempt.getSubmittedAt());
        response.setScore(attempt.getScore());
        response.setCorrectCount(attempt.getCorrectCount());
        response.setTotalQuestions(attempt.getTotalQuestions());
        response.setDurationSeconds(attempt.getDurationSeconds());
        response.setStatus(attempt.getStatus());
        response.setCreatedAt(attempt.getCreatedAt());
        response.setUpdatedAt(attempt.getUpdatedAt());
        return response;
    }

    private UserPracticeAttemptDetailResponse buildAttemptDetail(UserPracticeAttempt attempt, List<UserPracticeAnswer> answers) {
        Map<Long, UserPracticeAnswer> answerByQuestionId = answers.stream()
                .collect(Collectors.toMap(answer -> answer.getQuestion().getId(), answer -> answer));

        List<PracticeSetQuestion> practiceQuestions = getPracticeQuestions(attempt.getPracticeSet().getId());
        UserPracticeAttemptDetailResponse response = new UserPracticeAttemptDetailResponse();
        response.setAttemptId(attempt.getId());
        response.setPracticeSetId(attempt.getPracticeSet().getId());
        response.setPracticeSetTitle(attempt.getPracticeSet().getTitle());
        response.setModuleId(attempt.getPracticeSet().getModule() != null ? attempt.getPracticeSet().getModule().getId() : null);
        response.setModuleTitle(attempt.getPracticeSet().getModule() != null ? attempt.getPracticeSet().getModule().getTitle() : null);
        response.setStartedAt(attempt.getStartedAt());
        response.setSubmittedAt(attempt.getSubmittedAt());
        response.setScore(attempt.getScore());
        response.setCorrectCount(attempt.getCorrectCount());
        response.setTotalQuestions(attempt.getTotalQuestions());
        response.setDurationSeconds(attempt.getDurationSeconds());
        response.setStatus(attempt.getStatus());
        response.setAnswers(practiceQuestions.stream().map(question -> buildReviewItem(question, answerByQuestionId.get(question.getQuestion().getId()))).collect(Collectors.toList()));
        return response;
    }

    private UserPracticeAttemptDetailResponse.QuestionReviewItem buildReviewItem(PracticeSetQuestion practiceQuestion, UserPracticeAnswer answer) {
        Question question = practiceQuestion.getQuestion();
        UserPracticeAttemptDetailResponse.QuestionReviewItem item = new UserPracticeAttemptDetailResponse.QuestionReviewItem();
        item.setPracticeSetQuestionId(practiceQuestion.getId());
        item.setQuestionId(question.getId());
        item.setSortOrder(practiceQuestion.getSortOrder());
        item.setPartNo(question.getPartNo());
        item.setQuestionText(question.getQuestionText());
        item.setExplanation(question.getExplanation());
        item.setDifficultyLevel(question.getDifficultyLevel());
        item.setSourceType(question.getSourceType() != null ? question.getSourceType().name() : null);
        item.setSourceYear(question.getSourceYear());
        item.setSelectedOptionId(answer != null && answer.getSelectedOption() != null ? answer.getSelectedOption().getId() : null);
        item.setSelectedLabel(answer != null && answer.getSelectedOption() != null ? answer.getSelectedOption().getOptionLabel() : null);
        item.setSelectedText(answer != null && answer.getSelectedOption() != null ? answer.getSelectedOption().getOptionText() : null);
        QuestionOption correctOption = question.getOptions().stream().filter(option -> Boolean.TRUE.equals(option.getCorrect())).findFirst().orElse(null);
        item.setCorrectOptionId(correctOption != null ? correctOption.getId() : null);
        item.setCorrectLabel(correctOption != null ? correctOption.getOptionLabel() : null);
        item.setCorrectText(correctOption != null ? correctOption.getOptionText() : null);
        item.setCorrect(answer != null && Boolean.TRUE.equals(answer.getCorrect()));
        item.setOptions(question.getOptions().stream().map(option -> {
            UserPracticeAttemptDetailResponse.OptionItem opt = new UserPracticeAttemptDetailResponse.OptionItem();
            opt.setId(option.getId());
            opt.setOptionLabel(option.getOptionLabel());
            opt.setOptionText(option.getOptionText());
            opt.setCorrect(option.getCorrect());
            return opt;
        }).collect(Collectors.toList()));
        return item;
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private PracticeSet findPublishedPracticeSet(Long practiceSetId) {
        if (practiceSetId == null) {
            throw new AppException(ErrorCode.PRACTICE_SET_NOT_FOUND);
        }
        return practiceSetRepository.findByIdAndPublishedTrue(practiceSetId)
                .orElseThrow(() -> new AppException(ErrorCode.PRACTICE_SET_NOT_FOUND));
    }

    private List<PracticeSetQuestion> getPracticeQuestions(Long practiceSetId) {
        return practiceSetQuestionRepository.findByPracticeSetIdOrderBySortOrderAsc(practiceSetId);
    }

    private void ensureModuleExists(Long moduleId) {
        if (moduleId == null || !learningModuleRepository.existsById(moduleId)) {
            throw new AppException(ErrorCode.LEARNING_MODULE_NOT_FOUND);
        }
    }
}



