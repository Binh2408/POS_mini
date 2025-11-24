package com.example.be_pos_mini.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.be_pos_mini.entity.Product;
import com.example.be_pos_mini.entity.Store;
import com.example.be_pos_mini.repository.IProductRepository;
import com.example.be_pos_mini.repository.IStoreRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.time.LocalDateTime;
import java.nio.file.Paths;
import java.util.Optional;
import javax.imageio.ImageIO;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService {

    private final IProductRepository productRepository;
    private final IStoreRepository storeRepository;
    private final Cloudinary cloudinary;
    @Value("${app.upload.barcode-dir:uploads/barcodes}")
    private String barcodeDir;

    @Override
    public Optional<Product> findByStoreIdAndBarcode(Long storeId, String barcode) {
        return productRepository.findByStore_IdAndBarcode(storeId, barcode);
    }

    @Transactional
    @Override
    public Product save(Long storeId, Product product, MultipartFile imageFile) {

        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi nhánh ID = " + storeId));

        // Kiểm tra trùng barcode nếu có nhập tay
        if (product.getBarcode() != null && !product.getBarcode().isBlank()) {
            if (productRepository.findByStore_IdAndBarcode(storeId, product.getBarcode()).isPresent()) {
                throw new RuntimeException("Mã vạch đã tồn tại trong chi nhánh này");
            }
        } else {
            // Tạo barcode tự động
            String barcode = generateUniqueBarcode(storeId);
            product.setBarcode(barcode);
        }

        product.setStore(store);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        // 🟦 1. Upload ảnh sản phẩm lên Cloudinary nếu có
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                var uploadResult = cloudinary.uploader().upload(
                        imageFile.getBytes(),
                        ObjectUtils.asMap("folder", "pos/products")
                );
                product.setImageUrl(uploadResult.get("secure_url").toString());
            } catch (Exception e) {
                throw new RuntimeException("Không upload được ảnh sản phẩm", e);
            }
        }

        // 🟧 2. Tạo barcode + upload lên Cloudinary
        try {
            File barcodeFile = File.createTempFile("barcode-" + product.getBarcode(), ".png");
            generateBarcodeImageToFile(product.getBarcode(), barcodeFile.getAbsolutePath());

            String cloudinaryBarcodeUrl = uploadToCloudinary(barcodeFile, "pos/barcodes");
            product.setBarcodeImageUrl(cloudinaryBarcodeUrl);

            barcodeFile.delete();
        } catch (Exception e) {
            throw new RuntimeException("Không thể tạo ảnh mã vạch", e);
        }

        return productRepository.save(product);
    }


    @Override
    public byte[] generateBarcodeImage(String barcode) throws Exception {
        BitMatrix matrix = new MultiFormatWriter().encode(barcode, BarcodeFormat.EAN_13, 300, 150);
        java.io.ByteArrayOutputStream outputStream = new java.io.ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", outputStream);
        return outputStream.toByteArray();
    }

    @Override
    public Page<Product> findAllByStoreId(Long storeId, Pageable pageable) {
        return productRepository.findAllByStore_Id(storeId, pageable);
    }

    @Override
    public Page<Product> searchByStoreAndName(Long storeId, String name, Pageable pageable) {
        return productRepository.findByStore_IdAndNameContainingIgnoreCase(storeId, name, pageable);
    }

    @Override
    public Optional<Product> findById(Long id, Long storeId) {
        return productRepository.findByIdAndStore_Id(id, storeId);
    }

    @Override
    public Product update(Long id, Long storeId, Product productDetails, MultipartFile imageFile) {

        Product existing = productRepository.findByIdAndStore_Id(id, storeId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại trong chi nhánh này"));

        // Cập nhật thông tin
        existing.setName(productDetails.getName());
        existing.setCategory(productDetails.getCategory());
        existing.setUnit(productDetails.getUnit());
        existing.setPrice(productDetails.getPrice());
        existing.setCostPrice(productDetails.getCostPrice());
        existing.setStock(productDetails.getStock());
        existing.setReorderLevel(productDetails.getReorderLevel());
        existing.setUpdatedAt(LocalDateTime.now());

        // 🔵 Nếu có upload ảnh mới → upload lên Cloudinary
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                var uploadResult = cloudinary.uploader().upload(
                        imageFile.getBytes(),
                        ObjectUtils.asMap("folder", "pos/products")
                );
                existing.setImageUrl(uploadResult.get("secure_url").toString());
            } catch (Exception e) {
                throw new RuntimeException("Không upload được ảnh sản phẩm", e);
            }
        }

        return productRepository.save(existing);
    }


    @Override
    public void delete(Long id, Long storeId) {
        Product product = productRepository.findByIdAndStore_Id(id, storeId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại trong chi nhánh này"));
        productRepository.delete(product);
    }

    // ======== Helper methods ========

    private String generateUniqueBarcode(Long storeId) {
        String barcode;
        do {
            long randomNumber = (long) (Math.random() * 1_000_000_000L);
            String base = "893" + String.format("%09d", randomNumber);
            int checksum = calculateEAN13Checksum(base);
            barcode = base + checksum;
        } while (productRepository.findByStore_IdAndBarcode(storeId, barcode).isPresent());
        return barcode;
    }

    private int calculateEAN13Checksum(String code) {
        int sum = 0;
        for (int i = 0; i < code.length(); i++) {
            int digit = Character.getNumericValue(code.charAt(i));
            sum += (i % 2 == 0) ? digit : digit * 3;
        }
        return (10 - (sum % 10)) % 10;
    }

    private void generateBarcodeImageToFile(String barcode, String filePath) throws Exception {
        int width = 450; // width ~3x height
        int height = 150;

        BitMatrix matrix = new MultiFormatWriter().encode(barcode, BarcodeFormat.EAN_13, width, height);
        BufferedImage image = MatrixToImageWriter.toBufferedImage(matrix);

        // Vẽ số bên dưới
        int fontSize = 24;
        BufferedImage finalImage = new BufferedImage(width, height + fontSize + 10, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = finalImage.createGraphics();
        g.setColor(Color.WHITE);
        g.fillRect(0, 0, finalImage.getWidth(), finalImage.getHeight());
        g.drawImage(image, 0, 0, null);
        g.setColor(Color.BLACK);
        g.setFont(new Font("Arial", Font.PLAIN, fontSize));
        FontMetrics fm = g.getFontMetrics();
        int textWidth = fm.stringWidth(barcode);
        g.drawString(barcode, (width - textWidth) / 2, height + fontSize);
        g.dispose();

        ImageIO.write(finalImage, "PNG", new File(filePath));
    }

    private String uploadToCloudinary(File file, String folder) {
        try {
            var result = cloudinary.uploader().upload(file, ObjectUtils.asMap(
                    "folder", folder
            ));
            return result.get("secure_url").toString();
        } catch (Exception e) {
            throw new RuntimeException("Không upload được file lên Cloudinary", e);
        }
    }

}
