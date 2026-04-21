package com.example.backend.dto.AIv2;

import lombok.Data;

import java.util.UUID;

@Data
public class VideoRecommendation {

    @Data
    public static class Request {
        private String data;

        // ✅ IMPORTANT
        private UUID lessonId;
    }
}