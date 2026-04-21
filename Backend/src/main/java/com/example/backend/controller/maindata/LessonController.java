package com.example.backend.controller.maindata;

import com.example.backend.repositry.dao.Lesson;
import com.example.backend.service.web.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/lessons")
public class LessonController {

    @Autowired
    private LessonService service;

    @PostMapping("/journey/{journeyId}")
    public Lesson create(@PathVariable UUID journeyId,
                         @RequestBody Lesson lesson) {
        return service.create(journeyId, lesson);
    }

    @GetMapping("/journey/{journeyId}")
    public List<Lesson> getByJourney(@PathVariable UUID journeyId) {
        return service.getByJourney(journeyId);
    }

    @GetMapping("/{id}")
    public Lesson getById(@PathVariable UUID id) {
        return service.getById(Lesson.class,id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(Lesson.class,id);
    }
}