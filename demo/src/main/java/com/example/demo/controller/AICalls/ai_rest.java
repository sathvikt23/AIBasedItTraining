package com.example.demo.controller.AICalls;
import com.example.demo.dto.AI.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.config.web.*;
import java.util.Map;
import com.example.demo.dto.AI.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/ai")
public class ai_rest {
    @Autowired
    private ApplicationContext context;


    @PostMapping("/transcribe")
    public ResponseEntity<Map<String,Object>> transcribe(@RequestBody Transcribe.Request req ){
        String url = "http://127.0.0.1:8032/api/v1/transcribe";

        RestTemplate restTemplate = context.getBean(RestTemplate.class);

        Map<String, Object> externalResponse = restTemplate.postForObject(
                url,
                Map.of("youtube_link",req.getYoutubeLink()),       // your request body
                Map.class      // expected response type
        );

        return ResponseEntity.ok().
                     body(externalResponse);
    }


    @PostMapping("/compilecodeai")
    public ResponseEntity<Map<String,Object>> aiCodeAnalysis(@RequestBody AICodeAnalysis.Request req ){
        String url = "http://127.0.0.1:8032/api/v1/code-analyze";
        RestTemplate restTemplate = context.getBean(RestTemplate.class);
        Map<String,Object> externalResponse = restTemplate.postForObject(
                url,
                Map.of("code",req.getCode(),"type","standard"),
                Map.class
        );
        return ResponseEntity.ok().body(
                Map.of(
                        "code",req.getCode(),
                        "analysis",externalResponse.get("analysis")

                )
        );
    }

    @PostMapping("/enhancetext")
    public ResponseEntity<Map<String,Object>> textEnhancer (@RequestBody EnhanceText.Request req ){
        String url = "http://127.0.0.1:8032/api/v1/text-process";
        RestTemplate restTemplate = context.getBean(RestTemplate.class);
        Map<String ,Object> externalResponse = restTemplate.postForObject(
                url,
                Map.of(
                        "text",req.getText(),
                        "type","enhance"

                ),
                Map.class
        );
        System.out.println(externalResponse);
        return  ResponseEntity.ok().body(
                Map.of(
                        "analysis",externalResponse.get("enhanced_text")
                )

        );
    }

    @PostMapping("/chatresponse")
    public ResponseEntity<Map<String,Object>> chatResponse (@RequestBody Chat.ChatRequest req ){
        String url ="http://127.0.0.1:8032/api/v1/chat";
        RestTemplate restTemplate= context.getBean(RestTemplate.class);
        Map<String , Object> externalResponse = restTemplate.postForObject(
                url,
                Map.of(
                        "question",req.getQuestion()
                ),
                 Map.class
        );
        return ResponseEntity.ok().body(
                Map.of(
                        "analysis",externalResponse.get("response")
                )
        );
    }
    @PostMapping("/lessonresponse")
    public ResponseEntity<Map<String,Object>> lessonresponse (@RequestBody Lesson.LessonRequest req ){
        String url ="http://127.0.0.1:8032/api/v1/chat-lesson";
        RestTemplate restTemplate= context.getBean(RestTemplate.class);
        Map<String , Object> externalResponse = restTemplate.postForObject(
                url,
                Map.of(
                            "context",req.getText(),
                        "question",req.getQuestion()
                ),
                Map.class
        );
        return ResponseEntity.ok().body(
                Map.of(
                        "analysis",externalResponse.get("response")
                )
        );
    }
    @PostMapping("/genques")
    public ResponseEntity<Map<String ,Object>> generateQuestions(@RequestBody GenerateQuestion.GenerateQuestionsRequest req ){
        String url ="http://127.0.0.1:8032/api/v1/text-process";

        RestTemplate restTemplate = context.getBean(RestTemplate.class);
        Map<Object,String >  externalResponse = restTemplate.postForObject(url,
                Map.of(
                        "text",req.getText(),
                        "type","questions"
                ),
        Map.class);

        return ResponseEntity.ok().body(
                Map.of(
                "questions",externalResponse.get("questions")
                ));
    }

    @PostMapping("/getvideo")
    public ResponseEntity<Map<String,Object>> getVideoRecomendations(@RequestBody VideoRecommendation.Request req ){
        String url ="http://127.0.0.1:8032/api/v1/recommendations";

        RestTemplate restTemplate = context.getBean(RestTemplate.class);
        Map<String , Object > externalResponse = restTemplate.postForObject(
                url,
                Map.of("transcript",req.getData()),
                Map.class
        );
        return ResponseEntity.ok().body(Map.of(
                "id",externalResponse.get("video_ids")
        ));
    }

    @PostMapping("/dsaques")
    public ResponseEntity<Map<String,Object>> getDsaQuestions(@RequestBody GenerateDSAQuestion.Request req ){
        String url ="http://127.0.0.1:8032/api/v1/dsa-generate";

        RestTemplate resTemplate = context.getBean(RestTemplate.class);
        Map<String , Object > externalResponse = resTemplate.postForObject(
                url,
                Map.of(
                        "topic",req.getData(),
                        "type","topic"
                ),
                Map.class
        );
        return ResponseEntity.ok().body(Map.of(
                "id",externalResponse.get("result")
        ));
    }

    @PostMapping("/cuscompilecodeai")
    public ResponseEntity<Map<String,Object>> customcodeAi (@RequestBody CustomCodeAnalysis.Request req ){
        String url ="http://127.0.0.1:8032/api/v1/code-analyze";

        RestTemplate restTemplate = context.getBean(RestTemplate.class);

        Map<String,Object> externalResponse = restTemplate.postForObject(
                url,
                Map.of(
                        "code",req.getCode(),
                        "type","custom",
                        "custom_prompt",req.getCustom_message()

                ),
                Map.class
        );
        return ResponseEntity.ok().body(Map.of(
                "code",req.getCode(),
                "analysis",externalResponse.get("analysis")
        ));
    }
}

