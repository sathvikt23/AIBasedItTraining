package com.example.backend.config.web;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    //@Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
