package com.example.be_pos_mini.service.customer;

import com.example.be_pos_mini.entity.Customer;
import com.example.be_pos_mini.repository.ICustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService implements ICustomerService {
    private final ICustomerRepository customerRepository;

    @Override
    public List<Customer> searchByStore(Long storeId, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            keyword = "";
        }
        return customerRepository.searchCustomersByStoreAndKeyword(storeId, keyword);
    }
}
