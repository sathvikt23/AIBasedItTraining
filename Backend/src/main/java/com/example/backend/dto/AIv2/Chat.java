package com.example.backend.dto.AIv2;

import lombok.Data;

import java.util.UUID;

@Data
public class Chat {

    @Data
    public static class ChatRequest {
        private String question;

        // ✅ OPTIONAL (store context)
        private UUID lessonId;
    }
}