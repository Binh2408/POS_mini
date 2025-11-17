package com.example.be_pos_mini.service;

import com.example.be_pos_mini.dto.InvoiceDetailResponse;
import com.example.be_pos_mini.dto.ProductItemDTO;
import com.example.be_pos_mini.dto.InvoiceGroupedResponse;
import com.example.be_pos_mini.dto.InvoiceRequest;
import com.example.be_pos_mini.entity.*;
import com.example.be_pos_mini.enums.PaymentStatus;
import com.example.be_pos_mini.repository.ICustomerRepository;
import com.example.be_pos_mini.repository.IInvoiceRepository;
import com.example.be_pos_mini.repository.IProductRepository;
import com.example.be_pos_mini.repository.IUserRepository;
import com.example.be_pos_mini.service.qr.VietQRService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceService implements IInvoiceService {

    private final IInvoiceRepository invoiceRepository;
    private final IProductRepository productRepository;
    private final IUserRepository userRepository;
    private final ICustomerRepository customerRepository;
    private final VietQRService vietQRService;

    @Override
    public Invoice createInvoice(InvoiceRequest request) {
        //  1. Xử lý khách hàng
        Customer customer = null;

        if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId()).orElse(null);
        } else if (request.getCustomerPhone() != null && !request.getCustomerPhone().isEmpty()) {
            customer = customerRepository.findByPhone(request.getCustomerPhone()).orElse(null);
            if (customer == null) {
                customer = Customer.builder()
                        .name(request.getCustomerName())
                        .phone(request.getCustomerPhone())
                        .email(request.getCustomerEmail())
                        .points(0)
                        .createdAt(LocalDateTime.now())
                        .build();
                customerRepository.save(customer);
            }
        }

        // 2. Lấy nhân viên thu ngân
        User cashier = userRepository.findById(request.getCashierId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên thu ngân"));

        // 3. Sinh mã hóa đơn
        String code = "HD" + System.currentTimeMillis();

        // 4. Tạo danh sách chi tiết hóa đơn
        List<InvoiceDetail> details = request.getItems().stream().map(item -> {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm ID: " + item.getProductId()));

            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ hàng tồn");
            }

            double subtotal = product.getPrice() * item.getQuantity();

            return InvoiceDetail.builder()
                    .product(product)
                    .quantity(item.getQuantity())
                    .unitPrice(product.getPrice())
                    .subtotal(subtotal)
                    .build();
        }).collect(Collectors.toList());

        double total = details.stream().mapToDouble(InvoiceDetail::getSubtotal).sum();
        double discount = request.getDiscount() != null ? request.getDiscount() : 0.0;
        double finalAmount = total - discount;

        // 5. Tạo hóa đơn
        Invoice invoice = Invoice.builder()
                .code(code)
                .customer(customer)
                .cashier(cashier)
                .totalAmount(total)
                .discount(discount)
                .finalAmount(finalAmount)
                .paymentMethod(request.getPaymentMethod())
                .status(PaymentStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        details.forEach(d -> d.setInvoice(invoice));
        invoice.setDetails(details);

        // 6. Sinh mã QR VietQR
        String qrUrl = vietQRService.generateQRCode(finalAmount, code);
        invoice.setQrUrl(qrUrl);

        return invoiceRepository.save(invoice);
    }

    @Override
    public Invoice updateStatus(String code, PaymentStatus status) {
        Invoice invoice = invoiceRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn mã: " + code));

        // Khi chuyển sang PAID
        if (status == PaymentStatus.PAID && invoice.getStatus() != PaymentStatus.PAID) {
            // Giảm tồn kho
            invoice.getDetails().forEach(detail -> {
                Product product = detail.getProduct();
                int newStock = product.getStock() - detail.getQuantity();
                if (newStock < 0) {
                    throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ hàng tồn!");
                }
                product.setStock(newStock);
                productRepository.save(product);
            });

            // Cộng điểm thưởng
            if (invoice.getCustomer() != null) {
                Customer customer = invoice.getCustomer();
                int earnedPoints = (int) (invoice.getFinalAmount() / 10000); // 1 điểm mỗi 10k
                customer.setPoints(customer.getPoints() + earnedPoints);
                customerRepository.save(customer);
            }
        }

        invoice.setStatus(status);
        return invoiceRepository.save(invoice);
    }

    @Override
    public List<InvoiceGroupedResponse> getInvoices(Long storeId, String status, LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> results = invoiceRepository.findInvoicesWithDetails(storeId, status, startDate, endDate);
        Map<Long, InvoiceGroupedResponse> invoiceMap = new LinkedHashMap<>();

        for (Object[] row : results) {
            Long invoiceId = ((Number) row[0]).longValue();

            // Nếu hóa đơn chưa có trong map -> tạo mới
            InvoiceGroupedResponse invoice = invoiceMap.get(invoiceId);
            if (invoice == null) {
                invoice = new InvoiceGroupedResponse();
                invoice.setInvoiceId(invoiceId);
                invoice.setInvoiceCode((String) row[1]);
                invoice.setInvoiceDate(row[2].toString());
                invoice.setTotalAmount(row[3] != null ? ((Number) row[3]).doubleValue() : 0.0);
                invoice.setDiscount(row[4] != null ? ((Number) row[4]).doubleValue() : 0.0);
                invoice.setFinalAmount(row[5] != null ? ((Number) row[5]).doubleValue() : 0.0);
                invoice.setStatus((String) row[7]);

                invoice.setStoreId(row[8] != null ? ((Number) row[8]).longValue() : null);
                invoice.setStoreName((String) row[9]);
                invoice.setStoreAddress((String) row[10]);

                invoice.setCashierId(row[11] != null ? ((Number) row[11]).longValue() : null);
                invoice.setCashierName((String) row[12]);

                invoice.setCustomerId(row[13] != null ? ((Number) row[13]).longValue() : null);
                invoice.setCustomerName((String) row[14]);
                invoice.setCustomerPhone((String) row[15]);

                invoiceMap.put(invoiceId, invoice);
            }

            // Thêm sản phẩm vào danh sách products của hóa đơn
            ProductItemDTO product = new ProductItemDTO(
                    ((Number) row[16]).longValue(), // detail_id
                    ((Number) row[17]).longValue(), // product_id
                    (String) row[18],               // product_name
                    ((Number) row[19]).intValue(),  // quantity
                    ((Number) row[20]).doubleValue(), // unit_price
                    ((Number) row[21]).doubleValue()  // subtotal
            );

            invoice.getProducts().add(product);
        }

        return new ArrayList<>(invoiceMap.values());
    }
}
