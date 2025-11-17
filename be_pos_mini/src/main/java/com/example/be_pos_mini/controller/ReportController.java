package com.example.be_pos_mini.controller;

import com.example.be_pos_mini.dto.report.StoreMonthlyProfitDTO;
import com.example.be_pos_mini.dto.report.StoreMonthlyRevenueDTO;
import com.example.be_pos_mini.dto.report.StoreReportDTO;
import com.example.be_pos_mini.service.report.IReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reports")
public class ReportController {
    private final IReportService reportService;

    // 1️⃣ Tổng hợp doanh thu, lợi nhuận
    @GetMapping("/summary")
    public List<StoreReportDTO> getSummary(@RequestParam(required = false) Long storeId) {
        return reportService.getStoreSummary(storeId);
    }

    // 2️⃣ Doanh thu theo tháng
    @GetMapping("/monthly-revenue")
    public List<StoreMonthlyRevenueDTO> getMonthlyRevenue(@RequestParam(required = false) Long storeId) {
        return reportService.getMonthlyRevenue(storeId);
    }

    // 3️⃣ Lợi nhuận theo tháng
    @GetMapping("/monthly-profit")
    public List<StoreMonthlyProfitDTO> getMonthlyProfit(@RequestParam(required = false) Long storeId) {
        return reportService.getMonthlyProfit(storeId);
    }

    // ✅ API 1: Doanh thu theo danh mục
    @GetMapping("/category-revenue")
    public List<Map<String, Object>> getCategoryRevenue(@RequestParam(required = false) Long storeId) {
        return reportService.getCategoryRevenue(storeId);
    }

    // ✅ API 2: Doanh thu + phần trăm theo danh mục (cho biểu đồ tròn)
    @GetMapping("/category-revenue-percent")
    public List<Map<String, Object>> getCategoryRevenuePercent(@RequestParam(required = false) Long storeId) {
        return reportService.getCategoryRevenuePercent(storeId);
    }
}
