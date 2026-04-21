package com.example.backend.dto.AIv2;

import lombok.Data;

import java.util.UUID;

@Data
public class CustomCodeAnalysis {

    @Data
    public static class Request {
        private String code;
        private String custom_message;

        // ✅ OPTIONAL
        private UUID lessonId;
    }
}