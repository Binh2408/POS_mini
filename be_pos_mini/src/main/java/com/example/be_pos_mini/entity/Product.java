package com.example.be_pos_mini.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    private String unit;
    private Double price;
    private Double costPrice;
    private Integer stock;
    private Integer reorderLevel;

    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(length = 50, unique = true)
    private String barcode;

    // 🆕 Ảnh sản phẩm (URL hoặc tên file)
    @Column(name = "image_url", length = 255)
    private String imageUrl;

    // 🆕 Ảnh mã vạch (đường dẫn hoặc base64 nếu cần)
    @Column(name = "barcode_image_url", length = 255)
    private String barcodeImageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
