package com.example.be_pos_mini.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoreReportDTO {
    private Long storeId;
    private String storeName;
    private Long totalInvoices;
    private Double totalRevenue;
    private Double totalProfit;
}
