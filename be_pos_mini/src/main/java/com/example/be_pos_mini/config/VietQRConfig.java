package com.example.be_pos_mini.config;

import lombok.Data;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class VietQRConfig {
    @Value("${vietqr.bankCode}")
    private String bankCode;

    @Value("${vietqr.accountNo}")
    private String accountNo;

    @Value("${vietqr.accountName}")
    private String accountName;

    @Value("${vietqr.template}")
    private String template;
}
