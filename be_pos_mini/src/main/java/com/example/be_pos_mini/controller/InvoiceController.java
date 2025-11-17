package com.example.be_pos_mini.controller;

import com.example.be_pos_mini.dto.InvoiceGroupedResponse;
import com.example.be_pos_mini.dto.InvoiceRequest;
import com.example.be_pos_mini.entity.Invoice;
import com.example.be_pos_mini.enums.PaymentStatus;
import com.example.be_pos_mini.service.IInvoiceService;
import com.example.be_pos_mini.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {
    private final IInvoiceService invoiceService;
    private final IUserService userService;

    @PostMapping
    public ResponseEntity<?> createInvoice(@RequestBody InvoiceRequest request) {
        try {
            Invoice invoice = invoiceService.createInvoice(request);
            return ResponseEntity.ok(invoice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Lỗi khi tạo hóa đơn: " + e.getMessage());
        }
    }

    @PutMapping("/{code}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String code,
            @RequestParam PaymentStatus status) {
        try {
            Invoice updated = invoiceService.updateStatus(code, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Lỗi cập nhật trạng thái: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getInvoices(
            @RequestParam(required = false) Long storeId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        try {
            // 🔹 Nếu storeId chưa có => tự động tìm theo userId
            if (storeId == null && userId != null) {
                storeId = userService.getStoreIdByUserId(userId);
            }

            // 🔹 Gọi service lấy danh sách hóa đơn
            List<InvoiceGroupedResponse> invoices = invoiceService.getInvoices(storeId, status, startDate, endDate);
            return ResponseEntity.ok(invoices);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Lỗi khi lấy danh sách hóa đơn: " + e.getMessage());
        }
    }
}
