package com.example.be_pos_mini.repository;

import com.example.be_pos_mini.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface IProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByStore_IdAndBarcode(Long storeId, String barcode);

    Page<Product> findAllByStore_Id(Long storeId, Pageable pageable);

    Page<Product> findByStore_IdAndNameContainingIgnoreCase(Long storeId, String name, Pageable pageable);

    Optional<Product> findByIdAndStore_Id(Long id, Long storeId);

    void deleteByIdAndStore_Id(Long id, Long storeId);

    // Sản phẩm tồn kho thấp hơn mức cảnh báo
    @Query("SELECT p FROM Product p WHERE p.store.id = :storeId AND p.stock <= p.reorderLevel")
    List<Product> findLowStockProducts(Long storeId);

    // Tổng số sản phẩm trong cửa hàng
    @Query("SELECT COUNT(p) FROM Product p WHERE p.store.id = :storeId")
    Long countByStore(Long storeId);
}
