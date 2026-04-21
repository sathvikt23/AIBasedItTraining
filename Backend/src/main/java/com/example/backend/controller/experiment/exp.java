package com.example.backend.controller.experiment;

import com.example.backend.service.web.experimentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roadmap")
public class exp {

    @Autowired
    private experimentService experimentService;


    @PostMapping("/create")
    public ResponseEntity<Map<String, Integer>> createRoadmap(@RequestBody Map<String, Object> req) {



        Map<String, Integer> ids = experimentService.createAll(req);
        return ResponseEntity.ok(ids);
    }




    @GetMapping("/journeys")
    public ResponseEntity<List<Integer>> getJourneyIds(@RequestParam int userId) {
        List<Integer> journeyIds = experimentService.getJourneyIdsByUserId(userId);
        return ResponseEntity.ok(journeyIds);
    }
    @GetMapping("/lesson/{lessonId}/details")
    public ResponseEntity<Map<String, Object>> getLessonDetails(@PathVariable int lessonId) {
        Map<String, Object> details = experimentService.getLessonDetailsById(lessonId);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/lessons")
    public ResponseEntity<List<Integer>> getLessonIds(@RequestParam int journeyId) {
        List<Integer> lessonIds = experimentService.getLessonIdsByJourneyId(journeyId);
        return ResponseEntity.ok(lessonIds);
    }

    @GetMapping("/{roadmapId}/map")
    public ResponseEntity<Map<String, Object>> getRoadmapMap(@PathVariable int roadmapId) {
        Map<String, Object> map = experimentService.getRoadmapMapById(roadmapId);
        if (map != null) {
            return ResponseEntity.ok(map);
        }
        return ResponseEntity.notFound().build();
    }


    @PutMapping("/{roadmapId}/map")
    public ResponseEntity<String> updateRoadmapMap(
            @PathVariable int roadmapId,
            @RequestBody Map<String, Object> newMap
    ) {
        experimentService.updateRoadmapMap(roadmapId, newMap);
        return ResponseEntity.ok("Roadmap updated successfully");
    }

}