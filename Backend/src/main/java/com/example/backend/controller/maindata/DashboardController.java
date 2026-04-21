package com.example.backend.controller.maindata;

import com.example.backend.repositry.dao.Dashboard;
import com.example.backend.service.web.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/dashboards")
public class DashboardController {

    @Autowired
    private DashboardService service;

    @PostMapping("/user/{userId}")
    public Dashboard create(@PathVariable UUID userId,
                            @RequestBody Dashboard dashboard) {
        return service.create(userId, dashboard);
    }

    @GetMapping("/user/{userId}")
    public List<Dashboard> getByUser(@PathVariable UUID userId) {
        return service.getByUser(userId);
    }

    @GetMapping("/{id}")
    public Dashboard getById(@PathVariable UUID id) {
        return service.getById(Dashboard.class ,id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(Dashboard.class,id);
    }
}