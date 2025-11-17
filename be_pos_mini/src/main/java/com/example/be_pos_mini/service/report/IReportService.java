package com.example.be_pos_mini.service.report;

import com.example.be_pos_mini.dto.report.StoreMonthlyProfitDTO;
import com.example.be_pos_mini.dto.report.StoreMonthlyRevenueDTO;
import com.example.be_pos_mini.dto.report.StoreReportDTO;

import java.util.List;
import java.util.Map;

public interface IReportService {
    List<StoreReportDTO> getStoreSummary(Long storeId);

    List<StoreMonthlyRevenueDTO> getMonthlyRevenue(Long storeId);

    List<StoreMonthlyProfitDTO> getMonthlyProfit(Long storeId);

    List<Map<String, Object>> getCategoryRevenue(Long storeId);

    List<Map<String, Object>> getCategoryRevenuePercent(Long storeId);
}
