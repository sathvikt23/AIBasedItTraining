package com.example.backend.controller.maindata;

import com.example.backend.repositry.dao.Dsa;
import com.example.backend.service.web.DsaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/dsa")
public class DsaController {

    @Autowired
    private DsaService service;

    @PostMapping("/lesson/{lessonId}")
    public Dsa create(@PathVariable UUID lessonId,
                      @RequestBody Dsa dsa) {
        return service.create(lessonId, dsa);
    }

    @GetMapping("/lesson/{lessonId}")
    public List<Dsa> getByLesson(@PathVariable UUID lessonId) {
        return service.getByLesson(lessonId);
    }

    @GetMapping("/{id}")
    public Dsa getById(@PathVariable UUID id) {
        return service.getById(Dsa.class,id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(Dsa.class,id);
    }
}