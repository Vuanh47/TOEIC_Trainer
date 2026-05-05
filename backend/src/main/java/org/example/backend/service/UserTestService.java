package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.SubmitTestAttemptRequest;
import org.example.backend.dto.response.TestAttemptResponse;
import org.example.backend.entity.*;
import org.example.backend.enums.AttemptStatus;
import org.example.backend.enums.ErrorCode;
import org.example.backend.exception.AppException;
import org.example.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserTestService {

    private final UserRepository userRepository;
    private final TestRepository testRepository;
    private final TestPartQuestionRepository testPartQuestionRepository;
    private final UserTestAttemptRepository userTestAttemptRepository;
    private final UserTestAnswerRepository userTestAnswerRepository;

    @Transactional(readOnly = true)
    public List<org.example.backend.dto.response.TestResponse> getPublishedTests() {
        return testRepository.findByPublishedTrueOrderByCreatedAtDesc()
                .stream()
                .map(t -> {
                    org.example.backend.dto.response.TestResponse r = new org.example.backend.dto.response.TestResponse();
                    r.setId(t.getId());
                    r.setTitle(t.getTitle());
                    r.setDescription(t.getDescription());
                    r.setPublished(t.getPublished());
                    r.setTestType(t.getTestType());
                    r.setTotalDurationMinutes(t.getTotalDurationMinutes());
                    return r;
                }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public org.example.backend.dto.response.TestResponse getTestById(Long testId) {
        Test test = findTest(testId);
        org.example.backend.dto.response.TestResponse r = new org.example.backend.dto.response.TestResponse();
        r.setId(test.getId());
        r.setTitle(test.getTitle());
        r.setDescription(test.getDescription());
        r.setPublished(test.getPublished());
        r.setTestType(test.getTestType());
        r.setTotalDurationMinutes(test.getTotalDurationMinutes());
        r.setParts(test.getParts() == null ? List.of() : test.getParts().stream().map(p -> {
            org.example.backend.dto.response.TestPartResponse pr = new org.example.backend.dto.response.TestPartResponse();
            pr.setId(p.getId());
            pr.setPartName(p.getPartName());
            pr.setPartNumber(p.getPartNumber());
            pr.setDescription(p.getDescription());
            pr.setDurationMinutes(p.getDurationMinutes());
            pr.setQuestionCount(p.getQuestionCount());
            pr.setQuestions(p.getQuestions() == null ? List.of() : p.getQuestions().stream().map(q -> {
                org.example.backend.dto.response.TestPartQuestionResponse qr = new org.example.backend.dto.response.TestPartQuestionResponse();
                qr.setId(q.getId());
                qr.setQuestionId(q.getQuestion().getId());
                qr.setQuestionText(q.getQuestion().getQuestionText());
                qr.setSortOrder(q.getSortOrder());
                qr.setPartNo(q.getQuestion().getPartNo());
                qr.setDifficultyLevel(q.getQuestion().getDifficultyLevel());
                qr.setOptions(q.getQuestion().getOptions() == null ? List.of() : q.getQuestion().getOptions().stream().map(o -> {
                    org.example.backend.dto.response.QuestionOptionResponse or = new org.example.backend.dto.response.QuestionOptionResponse();
                    or.setId(o.getId());
                    or.setOptionLabel(o.getOptionLabel());
                    or.setOptionText(o.getOptionText());
                    // Do NOT set 'correct' to prevent cheating
                    return or;
                }).collect(Collectors.toList()));
                return qr;
            }).collect(Collectors.toList()));
            return pr;
        }).collect(Collectors.toList()));
        return r;
    }

    @Transactional
    public TestAttemptResponse startTest(String email, Long testId) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Test test = findTest(testId);

        UserTestAttempt attempt = new UserTestAttempt();
        attempt.setUser(user);
        attempt.setTest(test);
        attempt.setStartedAt(LocalDateTime.now());
        // calculate totalQuestions from test parts
        int total = test.getParts() == null ? 0 : test.getParts().stream().mapToInt(p -> p.getQuestionCount() == null ? 0 : p.getQuestionCount()).sum();
        attempt.setTotalQuestions(total);
        attempt.setStatus(AttemptStatus.IN_PROGRESS);

        userTestAttemptRepository.save(attempt);

        TestAttemptResponse resp = new TestAttemptResponse();
        resp.setAttemptId(attempt.getId());
        resp.setTestId(test.getId());
        resp.setTestTitle(test.getTitle());
        resp.setStartedAt(attempt.getStartedAt());
        resp.setTotalQuestions(attempt.getTotalQuestions());
        return resp;
    }

    @Transactional
    public TestAttemptResponse submitAttempt(String email, Long attemptId, SubmitTestAttemptRequest request) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        UserTestAttempt attempt = userTestAttemptRepository.findById(attemptId).orElseThrow(() -> new AppException(ErrorCode.INVALID_QUESTION_DATA));
        if (!attempt.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
        if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
            throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
        }

        // load mapping of questionId -> correct label
        List<Long> questionIds = request.getAnswers() == null ? List.of() : request.getAnswers().stream().map(SubmitTestAttemptRequest.AnswerSubmission::getTestPartQuestionId).collect(Collectors.toList());
        List<TestPartQuestion> tpqs = testPartQuestionRepository.findAllById(questionIds);
        Map<Long, TestPartQuestion> tpqMap = tpqs.stream().collect(Collectors.toMap(TestPartQuestion::getId, t -> t));

        int correct = 0;
        List<UserTestAnswer> answersToSave = new ArrayList<>();

        for (SubmitTestAttemptRequest.AnswerSubmission a : request.getAnswers()) {
            TestPartQuestion tpq = tpqMap.get(a.getTestPartQuestionId());
            if (tpq == null) continue;
            // find correct option label for question
            String correctLabel = tpq.getQuestion().getOptions().stream().filter(o -> Boolean.TRUE.equals(o.getCorrect())).findFirst().map(org.example.backend.entity.QuestionOption::getOptionLabel).orElse(null);
            boolean isCorrect = correctLabel != null && correctLabel.equalsIgnoreCase(a.getSelectedLabel());
            if (isCorrect) correct++;

            UserTestAnswer uta = new UserTestAnswer();
            uta.setAttempt(attempt);
            uta.setTestPartQuestion(tpq);
            uta.setSelectedLabel(a.getSelectedLabel());
            uta.setCorrect(isCorrect);
            answersToSave.add(uta);
        }

        userTestAnswerRepository.saveAll(answersToSave);

        attempt.setSubmittedAt(LocalDateTime.now());
        attempt.setCorrectCount(correct);
        attempt.setTotalQuestions(attempt.getTotalQuestions() == null ? request.getAnswers().size() : attempt.getTotalQuestions());
        double score = attempt.getTotalQuestions() == 0 ? 0.0 : ((double) correct / (double) attempt.getTotalQuestions()) * 100.0;
        attempt.setScore(score);
        attempt.setStatus(AttemptStatus.SUBMITTED);
        userTestAttemptRepository.save(attempt);

        // build response
        TestAttemptResponse resp = new TestAttemptResponse();
        resp.setAttemptId(attempt.getId());
        resp.setTestId(attempt.getTest().getId());
        resp.setTestTitle(attempt.getTest().getTitle());
        resp.setStartedAt(attempt.getStartedAt());
        resp.setSubmittedAt(attempt.getSubmittedAt());
        resp.setScore(attempt.getScore());
        resp.setCorrectCount(attempt.getCorrectCount());
        resp.setTotalQuestions(attempt.getTotalQuestions());

        List<TestAttemptResponse.QuestionAnswerResult> details = answersToSave.stream().map(this::buildQuestionAnswerResult).collect(Collectors.toList());

        resp.setAnswers(details);
        return resp;
    }

    @Transactional(readOnly = true)
    public List<org.example.backend.dto.response.TestAttemptResponse> getAttemptsForUser(String email) {
        org.example.backend.entity.User user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userTestAttemptRepository.findByUserIdOrderByStartedAtDesc(user.getId()).stream().map(attempt -> {
            org.example.backend.dto.response.TestAttemptResponse r = new org.example.backend.dto.response.TestAttemptResponse();
            r.setAttemptId(attempt.getId());
            r.setTestId(attempt.getTest().getId());
            r.setTestTitle(attempt.getTest().getTitle());
            r.setStartedAt(attempt.getStartedAt());
            r.setSubmittedAt(attempt.getSubmittedAt());
            r.setScore(attempt.getScore());
            r.setCorrectCount(attempt.getCorrectCount());
            r.setTotalQuestions(attempt.getTotalQuestions());
            return r;
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public org.example.backend.dto.response.TestAttemptResponse getAttemptDetails(String email, Long attemptId) {
        org.example.backend.entity.User user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        UserTestAttempt attempt = userTestAttemptRepository.findById(attemptId).orElseThrow(() -> new AppException(ErrorCode.INVALID_QUESTION_DATA));
        
        // Verify user owns this attempt
        if (!attempt.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }

        // Build response with full details
        org.example.backend.dto.response.TestAttemptResponse r = new org.example.backend.dto.response.TestAttemptResponse();
        r.setAttemptId(attempt.getId());
        r.setTestId(attempt.getTest().getId());
        r.setTestTitle(attempt.getTest().getTitle());
        r.setStartedAt(attempt.getStartedAt());
        r.setSubmittedAt(attempt.getSubmittedAt());
        r.setScore(attempt.getScore());
        r.setCorrectCount(attempt.getCorrectCount());
        r.setTotalQuestions(attempt.getTotalQuestions());

        // Load all answers for this attempt
        List<UserTestAnswer> answers = userTestAnswerRepository.findByAttemptIdOrderByIdAsc(attemptId);
        List<org.example.backend.dto.response.TestAttemptResponse.QuestionAnswerResult> details = answers.stream().map(this::buildQuestionAnswerResult).collect(Collectors.toList());

        r.setAnswers(details);
        return r;
    }

    private org.example.backend.dto.response.TestAttemptResponse.QuestionAnswerResult buildQuestionAnswerResult(UserTestAnswer u) {
        org.example.backend.dto.response.TestAttemptResponse.QuestionAnswerResult q = new org.example.backend.dto.response.TestAttemptResponse.QuestionAnswerResult();
        Question question = u.getTestPartQuestion().getQuestion();
        
        q.setTestPartQuestionId(u.getTestPartQuestion().getId());
        q.setPartNo(question.getPartNo());
        q.setQuestionText(question.getQuestionText());
        q.setExplanation(question.getExplanation());
        q.setDifficultyLevel(question.getDifficultyLevel());
        q.setSourceType(question.getSourceType() != null ? question.getSourceType().name() : null);
        q.setSourceYear(question.getSourceYear());
        q.setSelectedLabel(u.getSelectedLabel());
        q.setCorrectLabel(question.getOptions().stream().filter(o -> Boolean.TRUE.equals(o.getCorrect())).findFirst().map(org.example.backend.entity.QuestionOption::getOptionLabel).orElse(null));
        q.setCorrect(u.getCorrect());
        
        // Build options list
        List<org.example.backend.dto.response.TestAttemptResponse.OptionInfo> options = question.getOptions().stream().map(o -> {
            org.example.backend.dto.response.TestAttemptResponse.OptionInfo opt = new org.example.backend.dto.response.TestAttemptResponse.OptionInfo();
            opt.setOptionLabel(o.getOptionLabel());
            opt.setOptionText(o.getOptionText());
            opt.setCorrect(o.getCorrect());
            return opt;
        }).collect(Collectors.toList());
        q.setOptions(options);
        
        return q;
    }

    private Test findTest(Long testId) {
        if (testId == null) throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
        return testRepository.findById(testId).orElseThrow(() -> new AppException(ErrorCode.INVALID_QUESTION_DATA));
    }
}

