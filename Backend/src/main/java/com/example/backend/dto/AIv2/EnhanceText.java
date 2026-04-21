package com.example.backend.dto.AIv2;

import lombok.Data;

import java.util.UUID;

@Data
public class EnhanceText {

    @Data
    public static class Request {
        private String text;

        // ✅ OPTIONAL → save back to lesson
        private UUID lessonId;
    }
}