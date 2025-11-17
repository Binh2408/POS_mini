package com.example.be_pos_mini.repository;

import com.example.be_pos_mini.entity.InvoiceDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IInvoiceDetailRepository extends JpaRepository<InvoiceDetail, Long> {
    // Top sản phẩm bán chạy theo chi nhánh
    @Query("SELECT d.product.name, SUM(d.quantity) AS totalSold " +
            "FROM InvoiceDetail d " +
            "WHERE d.invoice.cashier.store.id = :storeId " +
            "AND d.invoice.status = 'PAID' " +
            "GROUP BY d.product.name " +
            "ORDER BY totalSold DESC LIMIT 5")
    List<Object[]> findBestSellingProducts(Long storeId);
}
