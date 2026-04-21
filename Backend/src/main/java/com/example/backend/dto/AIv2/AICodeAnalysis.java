package com.example.backend.dto.AIv2;

import lombok.Data;

import java.util.UUID;

@Data
public class AICodeAnalysis {

    @Data
    public static class Request {
        private String code;

        // ✅ OPTIONAL (for DB mapping)
        private UUID lessonId;
    }
}