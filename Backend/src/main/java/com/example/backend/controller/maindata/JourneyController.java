package com.example.backend.controller.maindata;

import com.example.backend.repositry.dao.Journey;
import com.example.backend.service.web.JourneyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/journeys")
public class JourneyController {

    @Autowired
    private JourneyService service;

    @PostMapping("/user/{userId}")
    public Journey create(@PathVariable UUID userId,
                          @RequestBody Journey journey) {
        return service.create(userId, journey);
    }

    @GetMapping("/user/{userId}")
    public List<Journey> getByUser(@PathVariable UUID userId) {
        return service.getByUser(userId);
    }

    @GetMapping("/{id}")
    public Journey getById(@PathVariable UUID id) {
        return service.getById(Journey.class,id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(Journey.class,id);
    }
}