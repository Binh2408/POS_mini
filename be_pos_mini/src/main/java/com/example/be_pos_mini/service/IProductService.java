package com.example.be_pos_mini.service;

import com.example.be_pos_mini.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public interface IProductService {
    Optional<Product> findByStoreIdAndBarcode(Long storeId, String barcode);

    Product save(Long storeId, Product product, MultipartFile imageFile);

    byte[] generateBarcodeImage(String barcode) throws Exception;

    Page<Product> findAllByStoreId(Long storeId, Pageable pageable);

    Page<Product> searchByStoreAndName(Long storeId, String name, Pageable pageable);

    Optional<Product> findById(Long id, Long storeId);

    Product update(Long id, Long storeId, Product productDetails, MultipartFile imageFile);

    void delete(Long id, Long storeId);
}
