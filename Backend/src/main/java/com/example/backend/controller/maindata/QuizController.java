package com.example.backend.controller.maindata;

import com.example.backend.repositry.dao.Quiz;
import com.example.backend.service.web.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/quizzes")
public class QuizController {

    @Autowired
    private QuizService service;

    @PostMapping("/lesson/{lessonId}")
    public Quiz create(@PathVariable UUID lessonId,
                       @RequestBody Quiz quiz) {
        return service.create(lessonId, quiz);
    }

    @GetMapping("/lesson/{lessonId}")
    public List<Quiz> getByLesson(@PathVariable UUID lessonId) {
        return service.getByLesson(lessonId);
    }

    @GetMapping("/{id}")
    public Quiz getById(@PathVariable UUID id) {
        return service.getById(Quiz.class,id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(Quiz.class,id);
    }
}