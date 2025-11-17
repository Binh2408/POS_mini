package com.example.be_pos_mini.repository;

import com.example.be_pos_mini.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IReportRepository extends JpaRepository<Store, Long> {
    // 1️⃣ Tổng hợp theo store (doanh thu và lợi nhuận)
    @Query(value = """
                SELECT s.id AS storeId,
                       s.name AS storeName,
                       COUNT(DISTINCT i.id) AS totalInvoices,
                       SUM(idt.quantity * idt.unit_price) AS totalRevenue,
                       SUM(idt.quantity * (idt.unit_price - p.cost_price)) AS totalProfit
                FROM store s
                LEFT JOIN invoice i ON i.cashier_id IN (
                    SELECT u.id FROM user u WHERE u.store_id = s.id
                )
                LEFT JOIN invoice_detail idt ON idt.invoice_id = i.id
                LEFT JOIN product p ON p.id = idt.product_id
                WHERE i.status = 'PAID'
                AND (:storeId IS NULL OR s.id = :storeId)
                GROUP BY s.id, s.name
                ORDER BY totalRevenue DESC
            """, nativeQuery = true)
    List<Object[]> getStoreSummary(@Param("storeId") Long storeId);

    // 2️⃣ Doanh thu theo tháng
    @Query(value = """
                SELECT s.id AS storeId,
                       s.name AS storeName,
                       YEAR(i.created_at) AS year,
                       MONTH(i.created_at) AS month,
                       SUM(i.final_amount) AS monthlyRevenue
                FROM store s
                JOIN invoice i ON i.cashier_id IN (
                    SELECT u.id FROM user u WHERE u.store_id = s.id
                )
                WHERE i.status = 'PAID'
                AND (:storeId IS NULL OR s.id = :storeId)
                GROUP BY s.id, s.name, YEAR(i.created_at), MONTH(i.created_at)
                ORDER BY s.id, year, month
            """, nativeQuery = true)
    List<Object[]> getMonthlyRevenue(@Param("storeId") Long storeId);

    // 3️⃣ Lợi nhuận theo tháng
    @Query(value = """
                SELECT s.id AS storeId,
                       s.name AS storeName,
                       YEAR(i.created_at) AS year,
                       MONTH(i.created_at) AS month,
                       SUM(idt.quantity * (idt.unit_price - p.cost_price)) AS totalProfit
                FROM store s
                JOIN invoice i ON i.cashier_id IN (
                    SELECT u.id FROM user u WHERE u.store_id = s.id
                )
                JOIN invoice_detail idt ON idt.invoice_id = i.id
                JOIN product p ON p.id = idt.product_id
                WHERE i.status = 'PAID'
                AND (:storeId IS NULL OR s.id = :storeId)
                GROUP BY s.id, s.name, YEAR(i.created_at), MONTH(i.created_at)
                ORDER BY s.id, year, month
            """, nativeQuery = true)
    List<Object[]> getMonthlyProfit(@Param("storeId") Long storeId);

    // 1️⃣ Doanh thu theo danh mục
    @Query(value = """
            SELECT 
                c.id AS categoryId,
                c.name AS categoryName,
                SUM(idt.quantity * idt.unit_price) AS totalRevenue
            FROM category c
            JOIN product p ON p.category_id = c.id
            JOIN invoice_detail idt ON idt.product_id = p.id
            JOIN invoice i ON i.id = idt.invoice_id
            WHERE i.status = 'PAID'
            AND (:storeId IS NULL OR p.store_id = :storeId)
            GROUP BY c.id, c.name
            ORDER BY totalRevenue DESC
            """, nativeQuery = true)
    List<Object[]> getCategoryRevenue(@Param("storeId") Long storeId);

    // 2️⃣ Doanh thu + phần trăm theo danh mục
    @Query(value = """
            SELECT 
                c.id AS categoryId,
                c.name AS categoryName,
                SUM(idt.quantity * idt.unit_price) AS totalRevenue,
                ROUND(
                    (SUM(idt.quantity * idt.unit_price) / 
                    (SELECT SUM(idt2.quantity * idt2.unit_price)
                     FROM invoice_detail idt2
                     JOIN product p2 ON p2.id = idt2.product_id
                     JOIN invoice i2 ON i2.id = idt2.invoice_id
                     WHERE i2.status = 'PAID'
                     AND (:storeId IS NULL OR p2.store_id = :storeId)
                    ) * 100), 2
                ) AS revenuePercent
            FROM category c
            JOIN product p ON p.category_id = c.id
            JOIN invoice_detail idt ON idt.product_id = p.id
            JOIN invoice i ON i.id = idt.invoice_id
            WHERE i.status = 'PAID'
            AND (:storeId IS NULL OR p.store_id = :storeId)
            GROUP BY c.id, c.name
            ORDER BY totalRevenue DESC
            """, nativeQuery = true)
    List<Object[]> getCategoryRevenuePercent(@Param("storeId") Long storeId);
}
