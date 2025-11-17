package com.example.be_pos_mini.dto;

public interface InvoiceDetailResponse {
    Long getInvoiceId();

    String getInvoiceCode();

    String getInvoiceDate();

    Double getTotalAmount();

    Double getDiscount();

    Double getFinalAmount();

    String getPaymentMethod();

    String getStatus();

    Long getStoreId();

    String getStoreName();

    String getStoreAddress();

    Long getCashierId();

    String getCashierName();

    Long getCustomerId();

    String getCustomerName();

    String getCustomerPhone();

    Long getDetailId();

    Long getProductId();

    String getProductName();

    Integer getQuantity();

    Double getUnitPrice();

    Double getSubtotal();
}
