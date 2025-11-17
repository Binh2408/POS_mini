package com.example.be_pos_mini.service;

import com.example.be_pos_mini.dto.InvoiceGroupedResponse;
import com.example.be_pos_mini.dto.InvoiceRequest;
import com.example.be_pos_mini.entity.Invoice;
import com.example.be_pos_mini.enums.PaymentStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface IInvoiceService {
    Invoice createInvoice(InvoiceRequest request);

    Invoice updateStatus(String code, PaymentStatus status);

    List<InvoiceGroupedResponse> getInvoices(Long storeId, String status, LocalDateTime startDate, LocalDateTime endDate);
}
