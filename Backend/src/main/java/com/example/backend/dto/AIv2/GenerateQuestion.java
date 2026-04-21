package com.example.backend.dto.AIv2;

import lombok.Data;

import java.util.UUID;

@Data
public class GenerateQuestion {

    @Data
    public static class GenerateQuestionsRequest {
        private String text;

        // ✅ IMPORTANT → for Quiz mapping
        private UUID lessonId;
    }
}