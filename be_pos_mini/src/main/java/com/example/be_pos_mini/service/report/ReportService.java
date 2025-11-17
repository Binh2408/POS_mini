package com.example.be_pos_mini.service.report;

import com.example.be_pos_mini.dto.report.StoreMonthlyProfitDTO;
import com.example.be_pos_mini.dto.report.StoreMonthlyRevenueDTO;
import com.example.be_pos_mini.dto.report.StoreReportDTO;
import com.example.be_pos_mini.repository.IReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService implements IReportService {
    private final IReportRepository reportRepository;

    @Override
    public List<StoreReportDTO> getStoreSummary(Long storeId) {
        return reportRepository.getStoreSummary(storeId).stream()
                .map(r -> new StoreReportDTO(
                        ((Number) r[0]).longValue(),
                        (String) r[1],
                        r[2] != null ? ((Number) r[2]).longValue() : 0L,
                        r[3] != null ? ((Number) r[3]).doubleValue() : 0.0,
                        r[4] != null ? ((Number) r[4]).doubleValue() : 0.0
                )).collect(Collectors.toList());
    }

    @Override
    public List<StoreMonthlyRevenueDTO> getMonthlyRevenue(Long storeId) {
        return reportRepository.getMonthlyRevenue(storeId).stream()
                .map(r -> new StoreMonthlyRevenueDTO(
                        ((Number) r[0]).longValue(),
                        (String) r[1],
                        ((Number) r[2]).intValue(),
                        ((Number) r[3]).intValue(),
                        r[4] != null ? ((Number) r[4]).doubleValue() : 0.0
                )).collect(Collectors.toList());
    }

    @Override
    public List<StoreMonthlyProfitDTO> getMonthlyProfit(Long storeId) {
        return reportRepository.getMonthlyProfit(storeId).stream()
                .map(r -> new StoreMonthlyProfitDTO(
                        ((Number) r[0]).longValue(),
                        (String) r[1],
                        ((Number) r[2]).intValue(),
                        ((Number) r[3]).intValue(),
                        r[4] != null ? ((Number) r[4]).doubleValue() : 0.0
                )).collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getCategoryRevenue(Long storeId) {
        List<Object[]> results = reportRepository.getCategoryRevenue(storeId);
        List<Map<String, Object>> data = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> item = new HashMap<>();
            item.put("categoryId", row[0]);
            item.put("categoryName", row[1]);
            item.put("totalRevenue", row[2]);
            data.add(item);
        }
        return data;
    }

    @Override
    public List<Map<String, Object>> getCategoryRevenuePercent(Long storeId) {
        List<Object[]> results = reportRepository.getCategoryRevenuePercent(storeId);
        List<Map<String, Object>> data = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> item = new HashMap<>();
            item.put("categoryId", row[0]);
            item.put("categoryName", row[1]);
            item.put("totalRevenue", row[2]);
            item.put("revenuePercent", row[3]);
            data.add(item);
        }
        return data;
    }
}
