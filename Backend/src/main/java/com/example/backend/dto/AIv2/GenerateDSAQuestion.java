package com.example.backend.dto.AIv2;

import lombok.Data;

import java.util.UUID;

@Data
public class GenerateDSAQuestion {

    @Data
    public static class Request {
        private String data;

        // ✅ IMPORTANT → link to Lesson
        private UUID lessonId;
    }
}
