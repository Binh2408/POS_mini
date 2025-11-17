package com.example.be_pos_mini.controller;

import com.example.be_pos_mini.entity.Customer;
import com.example.be_pos_mini.service.customer.ICustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final ICustomerService customerService;

    @GetMapping("/search")
    public List<Customer> searchCustomers(
            @RequestParam Long storeId,
            @RequestParam(required = false) String keyword
    ) {
        return customerService.searchByStore(storeId, keyword);
    }
}
