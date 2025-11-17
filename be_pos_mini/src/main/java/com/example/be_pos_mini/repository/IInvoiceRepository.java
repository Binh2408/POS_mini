package com.example.be_pos_mini.repository;

import com.example.be_pos_mini.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface IInvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByCode(String code);

    @Query(value = """
                SELECT 
                    i.id AS invoice_id,
                    i.code AS invoice_code,
                    i.created_at AS invoice_date,
                    i.total_amount,
                    i.discount,
                    i.final_amount,
                    i.payment_method,
                    i.status,
                    s.id AS store_id,
                    s.name AS store_name,
                    s.address AS store_address,
                    u.id AS cashier_id,
                    u.full_name AS cashier_name,
                    c.id AS customer_id,
                    c.name AS customer_name,
                    c.phone AS customer_phone,
                    d.id AS detail_id,
                    p.id AS product_id,
                    p.name AS product_name,
                    d.quantity,
                    d.unit_price,
                    d.subtotal
                FROM invoice i
                JOIN user u ON i.cashier_id = u.id
                LEFT JOIN store s ON u.store_id = s.id
                LEFT JOIN customer c ON i.customer_id = c.id
                JOIN invoice_detail d ON i.id = d.invoice_id
                JOIN product p ON d.product_id = p.id
                WHERE 
                    (:storeId IS NULL OR s.id = :storeId)
                    AND (:status IS NULL OR i.status = :status)
                    AND (:startDate IS NULL OR i.created_at >= :startDate)
                    AND (:endDate IS NULL OR i.created_at <= :endDate)
                ORDER BY i.created_at DESC, i.id, d.id
            """, nativeQuery = true)
    List<Object[]> findInvoicesWithDetails(@Param("storeId") Long storeId, @Param("status") String status, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Tổng doanh thu theo chi nhánh
    @Query("SELECT SUM(i.finalAmount) FROM Invoice i " +
            "WHERE i.cashier.store.id = :storeId " +
            "AND i.status = 'PAID' " +
            "AND DATE(i.createdAt) = CURRENT_DATE")
    Double getTotalRevenueByStore(Long storeId);

    // Doanh thu 7 ngày gần nhất (để vẽ biểu đồ)
    @Query("SELECT DATE(i.createdAt), SUM(i.finalAmount) " +
            "FROM Invoice i WHERE i.cashier.store.id = :storeId " +
            "AND i.status = 'PAID' " +
            "AND i.createdAt >= :startDate " +
            "GROUP BY DATE(i.createdAt) ORDER BY DATE(i.createdAt)")
    List<Object[]> getRevenueLast7Days(Long storeId, LocalDateTime startDate);
}
