package com.example.backend.dto.AIv2;

import lombok.Data;

import java.util.UUID;

@Data
public class Transcribe {

    @Data
    public static class Request {
        private String youtubeLink;

        // ✅ IMPORTANT → attach transcript to lesson
        private UUID lessonId;

        // OPTIONAL → if creating new lesson
        private UUID journeyId;
    }
}