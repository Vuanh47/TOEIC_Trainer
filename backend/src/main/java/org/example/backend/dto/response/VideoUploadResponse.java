package org.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VideoUploadResponse {
    private String publicId;
    private String resourceType;
    private String format;
    private String secureUrl;
    private String playbackUrl;
    private Integer durationSeconds;
    private Long bytes;
}

