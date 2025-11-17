package com.example.be_pos_mini.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class InvoiceGroupedResponse {
    private Long invoiceId;
    private String invoiceCode;
    private String invoiceDate;
    private Double totalAmount;
    private Double discount;
    private Double finalAmount;
    private String status;
    private Long storeId;
    private String storeName;
    private String storeAddress;
    private Long cashierId;
    private String cashierName;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private List<ProductItemDTO> products = new ArrayList<>();
}
