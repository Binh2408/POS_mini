import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import CartSummary from "../components/CartSummary";
import BarcodeScanner from "../components/BarcodeScanner";
import productService from "../service/productService";
import invoiceService from "../service/invoiceService";
import InvoiceModal from "../components/InvoiceModal";
import toast from "react-hot-toast";
import {
  Search,
  Scan,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
} from "lucide-react";
import customerService from "../service/customerService";

export default function POS() {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [isScanning, setIsScanning] = useState(false);
  const [products, setProducts] = useState([]);
  const [createdInvoice, setCreatedInvoice] = useState(null);

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(9);
  const [totalPages, setTotalPages] = useState(0);

  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const user = JSON.parse(
    localStorage.getItem("pos_user") || '{"id":1,"name":"Admin"}'
  );
  const [branch] = useState(() =>
    JSON.parse(
      localStorage.getItem("selected_branch") || '{"id":1,"name":"Chi nhánh 1"}'
    )
  );

  useEffect(() => {
    const fetchProducts = async () => {
      if (!branch?.id) return;
      try {
        const data = await productService.getProductsByStore(
          branch.id,
          page,
          size,
          "id",
          "asc",
          keyword
        );
        setProducts(data.content || []);
        setTotalPages(data.totalPages || 1);
        console.log(data);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
        toast.error("Không thể tải danh sách sản phẩm!");
      }
    };
    fetchProducts();
  }, [branch.id, page, keyword, size]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
  };

  const handlePrevPage = () => page > 0 && setPage(page - 1);
  const handleNextPage = () => page < totalPages - 1 && setPage(page + 1);

  const handleAdd = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      return existing
        ? prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p))
        : [...prev, { ...product, qty: 1 }];
    });
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  const handleRemove = (index) => {
    const item = cart[index];
    setCart(cart.filter((_, i) => i !== index));
    toast.success(`Đã xóa ${item.name}`);
  };

  const handleUpdateQty = (i, q) =>
    setCart((prev) => {
      const c = [...prev];
      if (q > 0) c[i].qty = q;
      return c;
    });

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Giỏ hàng trống!");

    const invoiceRequest = {
      storeId: branch.id,
      cashierId: user?.id,
      customerName: customer.name || "Khách lẻ",
      customerPhone: customer.phone || "",
      items: cart.map((i) => ({
        productId: i.id,
        quantity: i.qty,
        price: i.price,
      })),
    };

    try {
      const invoice = await invoiceService.createInvoice(
        invoiceRequest,
        user.id
      );
      setCreatedInvoice(invoice);
      toast.success(`Đã tạo hóa đơn ${invoice.code}`);
    } catch (err) {
      console.error("Lỗi khi tạo hóa đơn:", err);
      toast.error("Không thể tạo hóa đơn!");
    }
  };

  const handleConfirmPaid = async () => {
    if (!createdInvoice) return;
    try {
      const updated = await invoiceService.updateInvoiceStatus(
        createdInvoice.code,
        "PAID"
      );
      toast.success(`Hóa đơn ${updated.code} đã thanh toán`);
      setCreatedInvoice(null);
      setCart([]);
      setCustomer({ name: "", phone: "" });
      setKeyword("");
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      toast.error("Không thể cập nhật trạng thái!");
    }
  };

  const handleCancelInvoice = async (code) => {
    try {
      await invoiceService.updateInvoiceStatus(code, "CANCELLED");
      toast.success(`Hóa đơn ${code} đã bị hủy`);
      setCreatedInvoice(null);
      setCart([]);
      setCustomer({ name: "", phone: "" });
      setKeyword("");
    } catch (err) {
      console.error("Lỗi khi hủy hóa đơn:", err);
      toast.error("Không thể hủy hóa đơn!");
    }
  };

  const handleDetected = async (barcode) => {
    console.log("Đã quét được:", barcode);
    try {
      const product = await productService.getProductByBarcode(
        branch.id,
        barcode
      );
      if (product) {
        handleAdd(product);
        setIsScanning(false);
        toast.success(`Đã quét: ${product.name}`);
      } else {
        toast.error(`Không tìm thấy sản phẩm: ${barcode}`);
      }
    } catch {
      toast.error("Không thể kết nối tới máy chủ!");
    }
  };

  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    if (isSelecting) {
      setIsSelecting(false);
      return; // 🔒 Không fetch khi vừa chọn khách hàng
    }

    const fetchCustomers = async () => {
      if (customer.name.length < 2 && customer.phone.length < 2) {
        setCustomerSuggestions([]);
        return;
      }
      try {
        const keyword = customer.phone || customer.name;
        const data = await customerService.getCustomerByNameOrPhone(
          branch.id,
          keyword
        );
        setCustomerSuggestions(data || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Lỗi khi tìm khách hàng:", err);
      }
    };

    const timeout = setTimeout(fetchCustomers, 300); // debounce nhẹ
    return () => clearTimeout(timeout);
  }, [customer.name, customer.phone]);

  const handleSelectCustomer = (c) => {
    setIsSelecting(true); // ✅ đánh dấu đang chọn
    setCustomer({ name: c.name, phone: c.phone });
    setShowSuggestions(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex flex-1 gap-6 p-6">
          {/* BÊN TRÁI - SẢN PHẨM */}
          <div className="flex-1 flex flex-col">
            {/* Thanh tìm kiếm */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <div className="flex justify-between items-center gap-4">
                <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                  <div className="relative flex-1">
                    <Search
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Tìm kiếm sản phẩm theo tên..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700"
                  >
                    Tìm
                  </button>
                </form>

                <button
                  onClick={() => setIsScanning(!isScanning)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all ${
                    isScanning
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                  }`}
                >
                  <Scan size={20} />
                  {isScanning ? "Tắt camera" : "Quét mã vạch"}
                </button>
              </div>
            </div>

            {isScanning && <BarcodeScanner onDetected={handleDetected} />}

            {/* Danh sách sản phẩm */}
            <div className="flex-1 bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Danh sách sản phẩm
              </h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {products.length > 0 ? (
                  products.map((p) => (
                    <ProductCard key={p.id} product={p} onAdd={handleAdd} />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12 text-gray-400">
                    Không có sản phẩm nào
                  </div>
                )}
              </div>

              <div className="flex justify-center items-center gap-4 pt-4 border-t">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                  Trước
                </button>
                <span className="font-semibold text-gray-700">
                  Trang {page + 1} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page >= totalPages - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Sau
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* BÊN PHẢI - KHÁCH + GIỎ */}
          <div className="w-96 flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-md p-6 relative">
              <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                <User className="text-blue-600" size={20} />
                Thông tin khách hàng
              </h3>

              <div className="space-y-4">
                {/* Ô nhập tên khách hàng */}
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                  />
                  <input
                    type="text"
                    placeholder="Tên khách hàng"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                    onFocus={() => setShowSuggestions(true)}
                  />
                </div>

                {/* Ô nhập số điện thoại */}
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                  />
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                    onFocus={() => setShowSuggestions(true)}
                  />
                </div>

                {/* Dropdown gợi ý - đẹp, mượt, có scroll */}
                {showSuggestions && customerSuggestions.length > 0 && (
                  <div className="absolute top-full left-6 right-6 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2">
                      {customerSuggestions.map((c, idx) => (
                        <div
                          key={c.id}
                          onClick={() => handleSelectCustomer(c)}
                          className={`
                flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-150
                hover:bg-blue-50 hover:shadow-sm border-b border-gray-100
                ${idx === customerSuggestions.length - 1 ? "border-b-0" : ""}
              `}
                        >
                          <div>
                            <div className="font-medium text-gray-800 text-sm">
                              {c.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {c.phone}
                            </div>
                          </div>
                          <div className="text-xs text-blue-600 font-medium">
                            Chọn
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Thông báo khi không có gợi ý nhưng đang tìm */}
                {showSuggestions &&
                  customerSuggestions.length === 0 &&
                  (customer.name.length >= 2 || customer.phone.length >= 2) && (
                    <div className="absolute top-full left-6 right-6 mt-2 bg-gray-50 border border-gray-200 rounded-xl p-4 text-center text-sm text-gray-500 shadow-md z-50">
                      Không tìm thấy khách hàng phù hợp
                    </div>
                  )}
              </div>

              {/* Nút xóa nhanh nếu có khách */}
              {customer.name && (
                <button
                  onClick={() => {
                    setCustomer({ name: "", phone: "" });
                    setShowSuggestions(false);
                  }}
                  className="mt-3 text-xs text-red-500 hover:text-red-700 underline transition-colors"
                >
                  Xóa thông tin khách
                </button>
              )}
            </div>

            <CartSummary
              cart={cart}
              onRemove={handleRemove}
              onUpdateQty={handleUpdateQty}
              onCheckout={handleCheckout}
            />
          </div>
        </main>
      </div>

      {createdInvoice && (
        <InvoiceModal
          invoice={createdInvoice}
          onCancel={handleCancelInvoice}
          onConfirm={handleConfirmPaid}
        />
      )}
    </div>
  );
}
