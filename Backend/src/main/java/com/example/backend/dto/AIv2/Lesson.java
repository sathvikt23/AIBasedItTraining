package com.example.backend.dto.AIv2;

import lombok.Data;

import java.util.UUID;

@Data
public class Lesson {

    @Data
    public static class LessonRequest {
        private String question;
        private String text;

        // ✅ IMPORTANT → which lesson this belongs to
        private UUID lessonId;
    }
}