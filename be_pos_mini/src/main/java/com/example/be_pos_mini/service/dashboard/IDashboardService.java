package com.example.be_pos_mini.service.dashboard;

import java.util.Map;

public interface IDashboardService {
    Map<String, Object> getDashboardStats(Long storeId);
}
