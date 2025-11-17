package com.example.be_pos_mini.controller;

import com.example.be_pos_mini.entity.Product;
import com.example.be_pos_mini.service.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final IProductService productService;

    @GetMapping("/store/{storeId}/barcode/{barcode}")
    public ResponseEntity<?> getByStoreAndBarcode(@PathVariable Long storeId, @PathVariable String barcode) {
        return productService.findByStoreIdAndBarcode(storeId, barcode)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/store/{storeId}")
    public ResponseEntity<?> createProduct(
            @PathVariable Long storeId,
            @RequestBody Product product) {
        try {
            Product saved = productService.save(storeId, product);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Tạo sản phẩm thành công",
                    "data", saved
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "message", "Không thể tạo sản phẩm",
                    "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/{storeId}/{id}")
    public ResponseEntity<?> getProductById(
            @PathVariable Long storeId,
            @PathVariable Long id) {

        return productService.findById(id, storeId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Sản phẩm không tồn tại trong chi nhánh này"));
    }

    // 🟡 Cập nhật sản phẩm trong chi nhánh
    @PutMapping("/store/{storeId}/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long storeId,
            @PathVariable Long id,
            @RequestBody Product productDetails
    ) {
        try {
            Product updated = productService.update(id, storeId, productDetails);
            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật sản phẩm thành công",
                    "data", updated
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "message", "Không tìm thấy sản phẩm cần cập nhật",
                    "error", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "message", "Đã xảy ra lỗi khi cập nhật sản phẩm",
                    "error", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{storeId}/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long storeId,
            @PathVariable Long id
    ) {
        try {
            productService.delete(id, storeId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping(value = "/barcode/image/{barcode}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getBarcodeImage(@PathVariable String barcode) {
        try {
            byte[] image = productService.generateBarcodeImage(barcode);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(image);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<?> getByStore(
            @PathVariable Long storeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String keyword
    ) {
        Pageable pageable = PageRequest.of(
                page, size,
                sortDir.equalsIgnoreCase("asc")
                        ? org.springframework.data.domain.Sort.by(sortBy).ascending()
                        : org.springframework.data.domain.Sort.by(sortBy).descending()
        );

        if (keyword != null && !keyword.isBlank()) {
            return ResponseEntity.ok(productService.searchByStoreAndName(storeId, keyword, pageable));
        }

        return ResponseEntity.ok(productService.findAllByStoreId(storeId, pageable));
    }
}
