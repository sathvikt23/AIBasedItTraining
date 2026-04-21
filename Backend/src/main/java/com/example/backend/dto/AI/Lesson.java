package com.example.backend.dto.AI;

import lombok.Data;

public class Lesson {
    @Data
    public static class LessonRequest{
        String question ;
        String text ;
    }
}
