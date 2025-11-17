package com.example.be_pos_mini.service.dashboard;

import com.example.be_pos_mini.entity.Product;
import com.example.be_pos_mini.repository.IInvoiceDetailRepository;
import com.example.be_pos_mini.repository.IInvoiceRepository;
import com.example.be_pos_mini.repository.IProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService implements IDashboardService {
    private final IInvoiceRepository invoiceRepository;
    private final IInvoiceDetailRepository invoiceDetailRepository;
    private final IProductRepository productRepository;

    @Override
    public Map<String, Object> getDashboardStats(Long storeId) {
        Map<String, Object> result = new HashMap<>();
        //Tổng doanh thu
        Double totalRevenue = invoiceRepository.getTotalRevenueByStore(storeId);
        result.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);

        //Sản phẩm bán chạy
        List<Object[]> bestSelling = invoiceDetailRepository.findBestSellingProducts(storeId);
        List<Map<String, Object>> bestProducts = new ArrayList<>();
        for (Object[] row : bestSelling) {
            Map<String, Object> map = new HashMap<>();
            map.put("productName", row[0]);
            map.put("quantitySold", row[1]);
            bestProducts.add(map);
        }
        result.put("bestSellingProducts", bestProducts);

        //Sản phẩm tồn kho thấp
        List<Product> lowStock = productRepository.findLowStockProducts(storeId);
        List<Map<String, Object>> lowStockList = new ArrayList<>();
        for (Product p : lowStock) {
            Map<String, Object> item = new HashMap<>();
            item.put("productName", p.getName());
            item.put("stock", p.getStock());
            item.put("reorderLevel", p.getReorderLevel());
            lowStockList.add(item);
        }
        result.put("lowStockProducts", lowStockList);

        //Tổng sản phẩm trong cửa hàng
        Long totalProducts = productRepository.countByStore(storeId);
        result.put("totalProducts", totalProducts != null ? totalProducts : 0L);

        //Doanh thu 7 ngày gần nhất
        LocalDateTime startDate = LocalDateTime.now().minusDays(7);
        List<Object[]> revenueByDay = invoiceRepository.getRevenueLast7Days(storeId, startDate);
        List<Map<String, Object>> revenueList = new ArrayList<>();
        for (Object[] row : revenueByDay) {
            Map<String, Object> dayRevenue = new HashMap<>();
            dayRevenue.put("date", row[0]);
            dayRevenue.put("total", row[1]);
            revenueList.add(dayRevenue);
        }
        result.put("revenueLast7Days", revenueList);

        return result;
    }
}
