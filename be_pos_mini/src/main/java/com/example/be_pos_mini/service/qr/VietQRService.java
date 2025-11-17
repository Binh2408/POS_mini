package com.example.be_pos_mini.service.qr;

import com.example.be_pos_mini.config.VietQRConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class VietQRService {
    private final VietQRConfig vietQRConfig;

    public String generateQRCode(double amount, String description) {
        try {
            String encodedInfo = URLEncoder.encode(description, StandardCharsets.UTF_8);
            String encodedName = URLEncoder.encode(vietQRConfig.getAccountName(), StandardCharsets.UTF_8);

            // ✅ Tạo link VietQR chuẩn của Napas (Techcombank)
            return String.format(
                    "https://img.vietqr.io/image/%s-%s-%s.png?amount=%d&addInfo=%s&accountName=%s",
                    vietQRConfig.getBankCode(),
                    vietQRConfig.getAccountNo(),
                    vietQRConfig.getTemplate(),
                    Math.round(amount), // tránh lỗi số thập phân
                    encodedInfo,
                    encodedName
            );
        } catch (Exception e) {
            throw new RuntimeException("Không thể tạo mã QR: " + e.getMessage(), e);
        }
    }
}
