package com.example.backend.dto.AIv2;

import lombok.Data;

@Data
public class CompileCode {

    @Data
    public static class Request {
        private String code;
        private String input;
        private Boolean isInput;
        private String language;
    }
}