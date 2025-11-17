import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import axios from "axios";
import {
  FileText,
  Eye,
  Download,
  Calendar,
  User,
  DollarSign,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  X,
} from "lucide-react";
import InvoiceDetailModal from "../components/invoice/InvoiceDetailModal";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Giả định userId lấy từ localStorage (hoặc session)
  const user = JSON.parse(
    localStorage.getItem("pos_user") || '{"id":1,"name":"Admin"}'
  );

  const selectedBranch = JSON.parse(
    localStorage.getItem("selected_branch") || "null"
  );

  useEffect(() => {
    if (selectedBranch?.id) {
      console.log("✅ Dùng chi nhánh trong storage:", selectedBranch.id);
      setStoreId(selectedBranch.id);
      fetchInvoices(selectedBranch.id);
    } else if (user?.id) {
      console.log("⚙️ Không có select_branch → Lấy theo user:", user.id);
      fetchStoreAndInvoices(user.id);
    } else {
      toast.error("Không tìm thấy thông tin người dùng!");
    }
  }, [filterStatus]);

  // ✅ Tự động gọi lại API khi xóa bộ lọc ngày
  useEffect(() => {
    if (storeId) {
      fetchInvoices(storeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId, startDate, endDate]);

  // 🔹 Gọi API lấy storeId theo userId nếu chưa có select_branch
  const fetchStoreAndInvoices = async (userId) => {
    try {
      setLoading(true);
      const storeRes = await axios.get(
        `http://localhost:8080/api/users/${userId}`,
        { withCredentials: true }
      );

      const storeId = storeRes.data;
      setStoreId(storeId);
      console.log("🔸 StoreId từ user:", storeId);

      await fetchInvoices(storeId);
    } catch (error) {
      console.error("❌ Lỗi khi lấy storeId:", error);
      toast.error("Không thể tải dữ liệu cửa hàng hoặc hóa đơn!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Gọi API lấy hóa đơn theo storeId
  const fetchInvoices = async (storeId) => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/invoices", {
        params: {
          storeId,
          status: filterStatus !== "ALL" ? filterStatus : undefined,
          startDate: startDate ? new Date(startDate).toISOString() : undefined,
          endDate: endDate ? new Date(endDate).toISOString() : undefined,
        },
        withCredentials: true,
      });
      setInvoices(res.data);
    } catch (error) {
      console.error("❌ Lỗi khi tải hóa đơn:", error);
      toast.error("Không thể tải dữ liệu hóa đơn!");
    } finally {
      setLoading(false);
    }
  };

  // format thời gian
  // 🔹 Đặt hàm này trên cùng trong component
  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 🔹 Lọc dữ liệu và phân trang
  const totalPages = Math.ceil(invoices.length / size);
  const displayedInvoices = invoices.slice(page * size, (page + 1) * size);

  // 🔹 Tính tổng doanh thu
  const totalRevenue = invoices
    .filter((inv) => inv.status === "PAID")
    .reduce((sum, inv) => sum + inv.finalAmount, 0);

  // 🔹 Hiển thị badge trạng thái
  const getStatusBadge = (status) => {
    const statusConfig = {
      PAID: {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: CheckCircle,
        label: "Đã thanh toán",
      },
      // PENDING: {
      //   bg: "bg-yellow-100",
      //   text: "text-yellow-700",
      //   icon: Clock,
      //   label: "Chờ thanh toán",
      // },
      CANCELLED: {
        bg: "bg-red-100",
        text: "text-red-700",
        icon: XCircle,
        label: "Đã hủy",
      },
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}
      >
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true); // ✅ mở modal
  };

  const handleDownloadInvoice = (invoice) => {
    toast.success(`Đang tải hóa đơn: ${invoice.invoiceCode}`);
  };
  const handleFilterByDate = () => {
    if (!storeId) return toast.error("Không xác định được chi nhánh!");
    fetchInvoices(storeId);
  };
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />

        <main className="p-6 flex-1">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
                    <FileText className="text-white" size={28} />
                  </div>
                  Quản lý hóa đơn
                </h1>
                <p className="text-gray-500 mt-2">
                  Tổng: {invoices.length} hóa đơn
                </p>
              </div>
            </div>

            {/* Tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">
                      Doanh thu
                    </p>
                    <p className="text-2xl font-bold text-green-700 mt-1">
                      {totalRevenue.toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                  <div className="bg-green-500 p-3 rounded-lg">
                    <DollarSign className="text-white" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">
                      Đã thanh toán
                    </p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">
                      {invoices.filter((inv) => inv.status === "PAID").length}
                    </p>
                  </div>
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <CheckCircle className="text-white" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 font-medium">Đã hủy</p>
                    <p className="text-2xl font-bold text-red-700 mt-1">
                      {
                        invoices.filter((inv) => inv.status === "CANCELLED")
                          .length
                      }
                    </p>
                  </div>
                  <div className="bg-red-500 p-3 rounded-lg">
                    <X className="text-white" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Lọc */}
            <div className="flex items-center gap-3 mb-4">
              <Filter className="text-gray-400" size={20} />
              <span className="text-sm font-medium text-gray-600">
                Lọc theo trạng thái:
              </span>
              <div className="flex gap-2">
                {["ALL", "PAID", "CANCELLED"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setPage(0);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterStatus === status
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {status === "ALL"
                      ? "Tất cả"
                      : status === "PAID"
                      ? "Đã thanh toán"
                      : status === "PENDING"
                      ? "Chờ thanh toán"
                      : "Đã hủy"}
                  </button>
                ))}
              </div>
              <div className="h-8 w-px bg-gray-300"></div>

              <div className="flex items-center gap-2">
                <Calendar className="text-gray-500" size={18} />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-400">→</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleFilterByDate}
                  disabled={!startDate && !endDate}
                  className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 text-sm font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Lọc
                </button>
                {(startDate || endDate) && (
                  <button
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                    }}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Xóa bộ lọc ngày"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bảng hóa đơn */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">
                      Mã hóa đơn
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">
                      Khách hàng
                    </th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">
                      Số món
                    </th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">
                      Tổng tiền
                    </th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">
                      Trạng thái
                    </th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">
                      Ngày tạo
                    </th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="p-12 text-center text-gray-500"
                      >
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : displayedInvoices.length > 0 ? (
                    displayedInvoices.map((invoice) => (
                      <tr key={invoice.invoiceId} className="hover:bg-gray-50">
                        <td className="p-4 font-semibold text-gray-800">
                          {invoice.invoiceCode}
                        </td>
                        <td className="p-4 text-gray-700">
                          {invoice.customerName || "Khách lẻ"}
                          {invoice.customerPhone && (
                            <p className="text-sm text-gray-500">
                              {invoice.customerPhone}
                            </p>
                          )}
                        </td>
                        <td className="p-4 text-center text-purple-700 font-semibold">
                          {invoice.products.length} món
                        </td>
                        <td className="p-4 text-center text-blue-600 font-bold">
                          {invoice.finalAmount.toLocaleString("vi-VN")}₫
                        </td>
                        <td className="p-4 text-center">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="p-4 text-center text-gray-600">
                          {formatDateTime(invoice.invoiceDate)}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleViewInvoice(invoice)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(invoice)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Tải xuống"
                          >
                            <Download size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="p-12 text-center text-gray-400"
                      >
                        Không có hóa đơn nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 p-6 border-t bg-gray-50">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                  Trước
                </button>

                <span className="font-semibold text-gray-700">
                  Trang {page + 1} / {totalPages}
                </span>

                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Sau
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </main>
        {isModalOpen && (
          <InvoiceDetailModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            invoice={selectedInvoice}
          />
        )}
      </div>
    </div>
  );
}
