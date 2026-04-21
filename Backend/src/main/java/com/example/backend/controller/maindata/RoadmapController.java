package com.example.backend.controller.maindata;

import com.example.backend.repositry.dao.Roadmap;
import com.example.backend.service.web.RoadmapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/roadmaps")
public class RoadmapController {

    @Autowired
    private RoadmapService service;

    // ✅ STEP 1: Create roadmap
    @PostMapping
    public Roadmap create(@RequestBody Roadmap roadmap) {
        return service.create(roadmap);
    }

    // ✅ STEP 2: Assign roadmap to journey
    @PutMapping("/{roadmapId}/assign/{journeyId}")
    public Roadmap assignToJourney(@PathVariable UUID roadmapId,
                                   @PathVariable UUID journeyId) {
        return service.assignToJourney(roadmapId, journeyId);
    }

    // ✅ Get by journey
    @GetMapping("/journey/{journeyId}")
    public List<Roadmap> getByJourney(@PathVariable UUID journeyId) {
        return service.getByJourney(journeyId);
    }

    // ✅ Get by id
    @GetMapping("/{id}")
    public Roadmap getById(@PathVariable UUID id) {
        return service.getById(id);
    }
}