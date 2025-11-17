package com.example.be_pos_mini.repository;

import com.example.be_pos_mini.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ICustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByPhone(String phone);

    @Query(value = """
            SELECT DISTINCT c.* 
            FROM customer c
            JOIN invoice i ON i.customer_id = c.id
            JOIN user u ON u.id = i.cashier_id
            WHERE u.store_id = :storeId
              AND (LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR c.phone LIKE CONCAT('%', :keyword, '%'))
            """, nativeQuery = true)
    List<Customer> searchCustomersByStoreAndKeyword(@Param("storeId") Long storeId,
                                                    @Param("keyword") String keyword);

}
