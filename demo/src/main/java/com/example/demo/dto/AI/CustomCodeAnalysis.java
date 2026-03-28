package com.example.demo.dto.AI;

import lombok.Data;

public class CustomCodeAnalysis {
    @Data
    public static class Request {
        String code;
        String custom_message;


    }
}
