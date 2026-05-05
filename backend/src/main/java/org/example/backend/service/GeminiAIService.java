package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.response.AIExplainResponse;
import org.example.backend.entity.TestPartQuestion;
import org.example.backend.enums.ErrorCode;
import org.example.backend.exception.AppException;
import org.example.backend.repository.TestPartQuestionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

@Service
@RequiredArgsConstructor
public class GeminiAIService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiAIService.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final TestPartQuestionRepository testPartQuestionRepository;

    // 🔥 ĐỔI KEY (OpenRouter)
    @Value("${openai.api-key}")
    private String apiKey;

    // 🔥 MODEL GEMMA FREE
    @Value("${openai.model:google/gemma-3-4b-it:free}")
    private String model;

    // 🔥 URL OpenRouter
    @Value("${openai.base-url:https://openrouter.ai/api/v1/chat/completions}")
    private String baseUrl;

    public AIExplainResponse explainQuestion(Long testPartQuestionId, String selectedAnswer, String type) {

        if (isBlank(apiKey)) {
            throw new AppException(ErrorCode.VIDEO_UPLOAD_CONFIG_MISSING);
        }

        TestPartQuestion tpq = testPartQuestionRepository.findById(testPartQuestionId)
                .orElseThrow(() -> new AppException(ErrorCode.QUESTION_NOT_FOUND));

        String questionText = tpq.getQuestion().getQuestionText();
        String explanation = tpq.getQuestion().getExplanation();

        String correctLabel = tpq.getQuestion().getOptions().stream()
                .filter(o -> Boolean.TRUE.equals(o.getCorrect()))
                .findFirst()
                .map(o -> o.getOptionLabel() + ": " + o.getOptionText())
                .orElse("N/A");

        List<String> allOptions = tpq.getQuestion().getOptions().stream()
                .map(o -> o.getOptionLabel() + ": " + o.getOptionText())
                .toList();

        String prompt = buildPrompt(questionText, allOptions, correctLabel, selectedAnswer, explanation, type);

        try {
            // ✅ BODY CHUẨN OpenRouter (OpenAI format)
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of(
                    "role", "user",
                    "content", prompt
            ));

            requestBody.put("messages", messages);

            // ✅ HEADER
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            // 🔥 OpenRouter khuyến nghị thêm
            headers.add("HTTP-Referer", "http://localhost:8080");
            headers.add("X-Title", "TOEIC App");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    baseUrl,
                    HttpMethod.POST,
                    request,
                    String.class
            );

            String aiResponse = parseResponse(response.getBody());

            AIExplainResponse result = new AIExplainResponse();
            result.setCorrectAnswer(correctLabel);
            result.setUserAnswer(selectedAnswer != null ? selectedAnswer : "Not answered");
            result.setExplanation(aiResponse);
            result.setTips(extractTips(aiResponse));

            return result;

        } catch (Exception e) {
            logger.error("OpenRouter error: {}", e.getMessage(), e);
            throw new AppException(ErrorCode.INVALID_QUESTION_DATA);
        }
    }

    // ✅ PARSE RESPONSE OpenAI FORMAT
    private String parseResponse(String body) {
        try {
            Map<String, Object> json = objectMapper.readValue(body, Map.class);
            List<Map<String, Object>> choices = (List<Map<String, Object>>) json.get("choices");

            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                return (String) message.get("content");
            }

        } catch (Exception e) {
            logger.error("Parse error: {}", e.getMessage());
        }
        return "AI response failed.";
    }

    private String buildPrompt(String question, List<String> options, String correctAnswer,
                               String userAnswer, String explanation, String type) {

        StringBuilder prompt = new StringBuilder();

        prompt.append("Câu hỏi TOEIC:\n");
        prompt.append(question).append("\n\n");

        prompt.append("Các đáp án:\n");
        options.forEach(o -> prompt.append(o).append("\n"));

        prompt.append("\nĐáp án đúng: ").append(correctAnswer).append("\n");

        if (userAnswer != null && !userAnswer.isBlank()) {
            prompt.append("Câu trả lời của người dùng: ").append(userAnswer).append("\n");
        }

        prompt.append("\nYêu cầu:\n");
        prompt.append("- Giải thích vì sao đáp án đúng là đúng (ngắn gọn, dễ hiểu)\n");
        prompt.append("- Nếu người dùng sai, giải thích lỗi sai\n");
        prompt.append("- Đưa ra 1-2 mẹo làm dạng câu này\n");

        prompt.append("\nQuy tắc:\n");
        prompt.append("- Trả lời bằng tiếng Việt\n"); // 🔥 QUAN TRỌNG
        prompt.append("- Ngắn gọn, tối đa 5 dòng\n");

        return prompt.toString();
    }

    private String extractTips(String response) {
        int idx = response.toLowerCase().indexOf("tip");
        return idx != -1 ? response.substring(idx) : response;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}