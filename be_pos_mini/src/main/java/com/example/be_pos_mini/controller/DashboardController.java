package com.example.be_pos_mini.controller;

import com.example.be_pos_mini.service.dashboard.IDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final IDashboardService dashboardService;

    @GetMapping("/{storeId}")
    public Map<String, Object> getDashboard(@PathVariable Long storeId) {
        return dashboardService.getDashboardStats(storeId);
    }
}
