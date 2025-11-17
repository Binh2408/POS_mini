package com.example.be_pos_mini.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoreMonthlyRevenueDTO {
    private Long storeId;
    private String storeName;
    private Integer year;
    private Integer month;
    private Double monthlyRevenue;
}
