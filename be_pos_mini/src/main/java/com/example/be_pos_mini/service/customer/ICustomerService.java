package com.example.be_pos_mini.service.customer;

import com.example.be_pos_mini.entity.Customer;

import java.util.List;

public interface ICustomerService {
    List<Customer> searchByStore(Long storeId, String keyword);
}
