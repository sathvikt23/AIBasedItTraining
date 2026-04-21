package com.example.backend.dto.AI;

import lombok.Data;

public class AICodeAnalysis {
    @Data
    public static class Request{
        String code;
    }
}
