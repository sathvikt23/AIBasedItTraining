package com.example.demo.dto.AI;

import lombok.Data;

public class CompileCode {
@Data
public static class Request{
    String code ;
    String input ;
    Boolean isInput;
    String language ;
}
}
