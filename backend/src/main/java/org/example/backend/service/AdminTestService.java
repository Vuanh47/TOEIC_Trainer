package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.AssignTestPartQuestionsRequest;
import org.example.backend.dto.request.CreateTestPartRequest;
import org.example.backend.dto.request.CreateTestRequest;
import org.example.backend.dto.request.UpdateTestPartRequest;
import org.example.backend.dto.request.UpdateTestRequest;
import org.example.backend.dto.response.TestResponse;
import org.example.backend.dto.response.TestPartResponse;
import org.example.backend.dto.response.TestPartQuestionResponse;
import org.example.backend.entity.Test;
import org.example.backend.entity.TestPart;
import org.example.backend.entity.TestPartQuestion;
import org.example.backend.entity.Question;
import org.example.backend.enums.ErrorCode;
import org.example.backend.exception.AppException;
import org.example.backend.mapper.TestMapper;
import org.example.backend.mapper.TestPartMapper;
import org.example.backend.mapper.TestPartQuestionMapper;
import org.example.backend.repository.TestRepository;
import org.example.backend.repository.TestPartRepository;
import org.example.backend.repository.TestPartQuestionRepository;
import org.example.backend.repository.QuestionRepository;
import org.example.backend.repository.UserTestAnswerRepository;
import org.example.backend.repository.UserTestAttemptRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminTestService {

    private final TestRepository testRepository;
    private final TestPartRepository testPartRepository;
    private final TestPartQuestionRepository testPartQuestionRepository;
    private final UserTestAnswerRepository userTestAnswerRepository;
    private final UserTestAttemptRepository userTestAttemptRepository;
    private final QuestionRepository questionRepository;
    private final TestMapper testMapper;
    private final TestPartMapper testPartMapper;
    private final TestPartQuestionMapper testPartQuestionMapper;

    // ===== Test Management =====

    @Transactional
    public TestResponse createTest(CreateTestRequest request) {
        if (request == null || isBlank(request.getTitle())) {
            throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
        }

        Test test = new Test();
        test.setTitle(request.getTitle());
        test.setDescription(request.getDescription());
        test.setTestType(request.getTestType() != null ? request.getTestType() : "FULL_TEST");
        test.setTotalDurationMinutes(request.getTotalDurationMinutes() != null ? request.getTotalDurationMinutes() : 120);
        test.setTargetScore(request.getTargetScore());
        test.setPublished(request.getPublished() != null ? request.getPublished() : false);

        return testMapper.toResponse(testRepository.save(test));
    }

    @Transactional(readOnly = true)
    public List<TestResponse> getAllTests() {
        return testMapper.toResponseList(testRepository.findAllByOrderByCreatedAtDesc());
    }

    @Transactional(readOnly = true)
    public List<TestResponse> getPublishedTests() {
        return testMapper.toResponseList(testRepository.findByPublishedTrueOrderByCreatedAtDesc());
    }

    @Transactional(readOnly = true)
    public TestResponse getTestById(Long testId) {
        return testMapper.toResponse(findTest(testId));
    }

    @Transactional
    public TestResponse updateTest(Long testId, UpdateTestRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
        }

        Test test = findTest(testId);

        if (request.getTitle() != null && !isBlank(request.getTitle())) {
            test.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            test.setDescription(request.getDescription());
        }
        if (request.getTestType() != null) {
            test.setTestType(request.getTestType());
        }
        if (request.getTotalDurationMinutes() != null) {
            test.setTotalDurationMinutes(request.getTotalDurationMinutes());
        }
        if (request.getTargetScore() != null) {
            test.setTargetScore(request.getTargetScore());
        }
        if (request.getPublished() != null) {
            test.setPublished(request.getPublished());
        }

        return testMapper.toResponse(testRepository.save(test));
    }

    @Transactional
    public void deleteTest(Long testId) {
        Test test = findTest(testId);
        userTestAnswerRepository.deleteByTestId(testId);
        userTestAttemptRepository.deleteByTestId(testId);
        testRepository.delete(test);
    }

    // ===== TestPart Management =====

    @Transactional
    public TestPartResponse createTestPart(Long testId, CreateTestPartRequest request) {
        if (request == null || isBlank(request.getPartName())) {
            throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
        }

        Test test = findTest(testId);

        TestPart part = new TestPart();
        part.setTest(test);
        part.setPartName(request.getPartName());
        part.setPartNumber(request.getPartNumber());
        part.setPartSection(request.getPartSection());
        part.setDescription(request.getDescription());
        part.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0);
        part.setDurationMinutes(request.getDurationMinutes());

        return testPartMapper.toResponse(testPartRepository.save(part));
    }

    @Transactional(readOnly = true)
    public List<TestPartResponse> getTestParts(Long testId) {
        findTest(testId); // Validate test exists
        return testPartMapper.toResponseList(testPartRepository.findByTestIdOrderBySortOrderAsc(testId));
    }

    @Transactional
    public TestPartResponse updateTestPart(Long testPartId, UpdateTestPartRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
        }

        TestPart part = findTestPart(testPartId);

        if (request.getPartName() != null && !isBlank(request.getPartName())) {
            part.setPartName(request.getPartName());
        }
        if (request.getDescription() != null) {
            part.setDescription(request.getDescription());
        }
        if (request.getDurationMinutes() != null) {
            part.setDurationMinutes(request.getDurationMinutes());
        }
        if (request.getSortOrder() != null) {
            part.setSortOrder(request.getSortOrder());
        }

        return testPartMapper.toResponse(testPartRepository.save(part));
    }

    @Transactional
    public void deleteTestPart(Long testPartId) {
        TestPart part = findTestPart(testPartId);
        // delete any user answers referencing questions in this part first to avoid FK constraint
        userTestAnswerRepository.deleteByTestPartId(testPartId);
        testPartQuestionRepository.deleteByTestPartId(testPartId);
        testPartRepository.delete(part);
    }

    // ===== TestPart Questions Management =====

    @Transactional
    public List<TestPartQuestionResponse> assignQuestionsToTestPart(
            Long testPartId,
            AssignTestPartQuestionsRequest request
    ) {
        if (request == null || request.getQuestionIds() == null || request.getQuestionIds().isEmpty()) {
            throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
        }

        TestPart part = findTestPart(testPartId);

        List<Long> newQuestionIds = request.getQuestionIds();
        List<Question> questions = questionRepository.findAllById(newQuestionIds);
        if (questions.size() != newQuestionIds.size()) {
            throw new AppException(ErrorCode.QUESTION_NOT_FOUND);
        }

        // Get current max sort order
        List<TestPartQuestion> existing = testPartQuestionRepository.findByTestPartIdOrderBySortOrderAsc(testPartId);
        int nextSortOrder = existing.isEmpty() ? 1 : existing.stream()
                .mapToInt(TestPartQuestion::getSortOrder)
                .max()
                .orElse(0) + 1;

        for (Long questionId : newQuestionIds) {
            Question question = questions.stream()
                    .filter(q -> q.getId().equals(questionId))
                    .findFirst()
                    .orElseThrow(() -> new AppException(ErrorCode.QUESTION_NOT_FOUND));

            TestPartQuestion tpq = new TestPartQuestion();
            tpq.setTestPart(part);
            tpq.setQuestion(question);
            tpq.setSortOrder(nextSortOrder++);

            testPartQuestionRepository.save(tpq);
        }

        // Update question count
        part.setQuestionCount(part.getQuestionCount() + newQuestionIds.size());
        testPartRepository.save(part);

        return testPartQuestionRepository.findByTestPartIdOrderBySortOrderAsc(testPartId).stream()
                .map(testPartQuestionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TestPartQuestionResponse> getTestPartQuestions(Long testPartId) {
        findTestPart(testPartId); // Validate exists
        return testPartQuestionRepository.findByTestPartIdOrderBySortOrderAsc(testPartId).stream()
                .map(testPartQuestionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeQuestionFromTestPart(Long testPartId, Long testPartQuestionId) {
        TestPart part = findTestPart(testPartId);
        TestPartQuestion tpq = testPartQuestionRepository.findById(testPartQuestionId)
                .orElseThrow(() -> new AppException(ErrorCode.QUESTION_NOT_FOUND));

        if (!tpq.getTestPart().getId().equals(testPartId)) {
            throw new AppException(ErrorCode.QUESTION_NOT_FOUND);
        }

        // remove any user answers that reference this question first
        userTestAnswerRepository.deleteByTestPartQuestionId(testPartQuestionId);
        testPartQuestionRepository.delete(tpq);
        part.setQuestionCount(Math.max(0, part.getQuestionCount() - 1));
        testPartRepository.save(part);
    }

    // ===== Helper Methods =====

    private Test findTest(Long testId) {
        if (testId == null) {
            throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
        }
        return testRepository.findById(testId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_QUESTION_DATA));
    }

    private TestPart findTestPart(Long testPartId) {
        if (testPartId == null) {
            throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
        }
        return testPartRepository.findById(testPartId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_QUESTION_DATA));
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}

