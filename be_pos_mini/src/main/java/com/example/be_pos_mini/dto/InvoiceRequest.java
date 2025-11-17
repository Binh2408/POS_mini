package com.example.be_pos_mini.dto;

import com.example.be_pos_mini.entity.Customer;
import com.example.be_pos_mini.entity.User;
import lombok.Data;

import java.util.List;

@Data
public class InvoiceRequest {
    private Long customerId;
    private String customerName;  // Nếu tạo mới
    private String customerPhone;
    private String customerEmail;
    
    private Long cashierId;
    private Double discount;
    private String paymentMethod;
    private List<ItemRequest> items;
}
