package org.example.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.example.backend.dto.response.VideoUploadResponse;
import org.example.backend.enums.ErrorCode;
import org.example.backend.exception.AppException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class CloudinaryUploadService {

    private static final Logger logger = LoggerFactory.getLogger(CloudinaryUploadService.class);

    private final ObjectMapper objectMapper;

    @Value("${cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${cloudinary.api-key:}")
    private String apiKey;

    @Value("${cloudinary.api-secret:}")
    private String apiSecret;

    @Value("${cloudinary.upload-folder:toeic-trainer/videos}")
    private String uploadFolder;

    @PostConstruct
    private void initializeAndValidate() {
        // Log loaded configuration (with masked secret for security)
        String maskedSecret = isBlank(apiSecret) ? "MISSING" : "***" + apiSecret.substring(Math.max(0, apiSecret.length() - 4));
        logger.info("Cloudinary config loaded - cloud_name: [{}], api_key: [{}...], api_secret: [{}], upload_folder: [{}]",
                isBlank(cloudName) ? "MISSING" : cloudName,
                isBlank(apiKey) ? "MISSING" : apiKey.substring(0, Math.min(4, apiKey.length())) + "...",
                maskedSecret,
                isBlank(uploadFolder) ? "default" : uploadFolder);
    }

    public VideoUploadResponse uploadVideo(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.VIDEO_UPLOAD_FAILED);
        }

        validateConfig();

        String originalName = file.getOriginalFilename() == null ? "video" : file.getOriginalFilename();
        long timestamp = Instant.now().getEpochSecond();
        String folder = uploadFolder == null ? "" : uploadFolder.trim();
        String signatureBase = folder.isEmpty()
                ? "timestamp=" + timestamp + apiSecret
                : "folder=" + folder + "&timestamp=" + timestamp + apiSecret;
        String signature = sha1Hex(signatureBase);
        String endpoint = "https://api.cloudinary.com/v1_1/" + cloudName + "/video/upload";

        MediaType mediaType = MediaType.parse(defaultMimeType(file.getContentType()));
        RequestBody fileBody;
        try {
            fileBody = RequestBody.create(file.getBytes(), mediaType);
        } catch (IOException exception) {
            throw new AppException(ErrorCode.VIDEO_UPLOAD_FAILED);
        }

        MultipartBody.Builder bodyBuilder = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("file", originalName, fileBody)
                .addFormDataPart("api_key", apiKey)
                .addFormDataPart("timestamp", String.valueOf(timestamp))
                .addFormDataPart("signature", signature);
        if (!folder.isEmpty()) {
            bodyBuilder.addFormDataPart("folder", folder);
        }

        Request request = new Request.Builder()
                .url(endpoint)
                .post(bodyBuilder.build())
                .build();

        OkHttpClient client = new OkHttpClient.Builder().build();
        try (Response response = client.newCall(request).execute()) {
            String raw = response.body() == null ? "" : response.body().string();
            if (!response.isSuccessful()) {
                // Log Cloudinary error body for easier debugging
                logger.error("Cloudinary upload failed. HTTP {} - response: {}", response.code(), raw);
                // Check if it's an invalid cloud_name error
                if (response.code() == 401 && raw.contains("Invalid cloud_name")) {
                    logger.error("Cloud name '{}' is invalid or does not exist in Cloudinary account. Check your CLOUDINARY_CLOUD_NAME env var.", cloudName);
                }
                throw new AppException(ErrorCode.VIDEO_UPLOAD_FAILED);
            }

            JsonNode root;
            try {
                root = objectMapper.readTree(raw);
            } catch (IOException parseEx) {
                logger.error("Failed to parse Cloudinary response: {}", raw, parseEx);
                throw new AppException(ErrorCode.VIDEO_UPLOAD_FAILED);
            }
            VideoUploadResponse result = new VideoUploadResponse();
            result.setPublicId(asText(root, "public_id"));
            result.setResourceType(asText(root, "resource_type"));
            result.setFormat(asText(root, "format"));
            result.setSecureUrl(asText(root, "secure_url"));
            result.setPlaybackUrl(result.getSecureUrl());
            result.setDurationSeconds(asIntSeconds(root, "duration"));
            result.setBytes(root.path("bytes").isNumber() ? root.path("bytes").asLong() : null);
            return result;
        } catch (IOException exception) {
            throw new AppException(ErrorCode.VIDEO_UPLOAD_FAILED);
        }
    }

    private void validateConfig() {
        if (isBlank(cloudName) || isBlank(apiKey) || isBlank(apiSecret)) {
            throw new AppException(ErrorCode.VIDEO_UPLOAD_CONFIG_MISSING);
        }
    }

    private String defaultMimeType(String contentType) {
        if (contentType == null || contentType.isBlank()) {
            return "application/octet-stream";
        }
        return contentType;
    }

    private Integer asIntSeconds(JsonNode root, String field) {
        if (!root.path(field).isNumber()) {
            return null;
        }
        return (int) Math.round(root.path(field).asDouble());
    }

    private String asText(JsonNode root, String field) {
        JsonNode node = root.path(field);
        if (node.isMissingNode() || node.isNull()) {
            return null;
        }
        return node.asText();
    }

    private String sha1Hex(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder(digest.length * 2);
            for (byte item : digest) {
                builder.append(String.format(Locale.ROOT, "%02x", item));
            }
            return builder.toString();
        } catch (Exception exception) {
            throw new AppException(ErrorCode.VIDEO_UPLOAD_FAILED);
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}

