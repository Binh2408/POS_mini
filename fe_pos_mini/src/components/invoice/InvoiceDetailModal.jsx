import React from "react";
import {
  X,
  User,
  Phone,
  Calendar,
  CreditCard,
  Package,
  DollarSign,
  FileText,
  Printer,
  Download,
  MapPin,
  UserCircle,
} from "lucide-react";

export default function InvoiceDetailModal({
  invoice,
  isOpen,
  onClose,
  onDownload,
  onPrint,
}) {
  if (!isOpen || !invoice) return null;

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700 border-green-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PAID":
        return "Đã thanh toán";
      case "PENDING":
        return "Chờ thanh toán";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <FileText size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Chi tiết hóa đơn</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Mã: {invoice.invoiceCode}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          {/* Thông tin chung */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Thông tin khách hàng */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="text-blue-600" size={20} />
                Thông tin khách hàng
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <User className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tên khách hàng</p>
                    <p className="font-semibold text-gray-800">
                      {invoice.customerName || "Khách lẻ"}
                    </p>
                  </div>
                </div>
                {invoice.customerPhone && (
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Phone className="text-green-600" size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Số điện thoại</p>
                      <p className="font-semibold text-gray-800">
                        {invoice.customerPhone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Thông tin cửa hàng và thu ngân */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="text-indigo-600" size={20} />
                Thông tin cửa hàng
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <MapPin className="text-indigo-600" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Chi nhánh</p>
                    <p className="font-semibold text-gray-800">
                      {invoice.storeName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {invoice.storeAddress}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <UserCircle className="text-purple-600" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Thu ngân</p>
                    <p className="font-semibold text-gray-800">
                      {invoice.cashierName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ngày tạo</p>
                    <p className="font-semibold text-gray-800">
                      {formatDateTime(invoice.invoiceDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CreditCard className="text-green-600" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Trạng thái</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {getStatusText(invoice.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Package className="text-orange-600" size={20} />
                Danh sách sản phẩm ({invoice.products.length} món)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      STT
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Tên sản phẩm
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                      Số lượng
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                      Đơn giá
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.products.map((p, index) => (
                    <tr key={p.detailId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-5 py-4 font-semibold text-gray-800">{p.productName}</td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {p.quantity}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right text-gray-700">
                        {p.unitPrice.toLocaleString("vi-VN")}₫
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-gray-800">
                        {p.subtotal.toLocaleString("vi-VN")}₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tổng kết */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tổng tiền hàng:</span>
                <span className="font-semibold text-gray-800 text-lg">
                  {invoice.totalAmount.toLocaleString("vi-VN")}₫
                </span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Giảm giá:</span>
                  <span className="font-semibold text-red-600 text-lg">
                    -{invoice.discount.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              )}
              <div className="border-t border-blue-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {invoice.finalAmount.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3 justify-end">
            {onPrint && (
              <button
                onClick={() => onPrint(invoice)}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
              >
                <Printer size={18} />
                In hóa đơn
              </button>
            )}
            {onDownload && (
              <button
                onClick={() => onDownload(invoice)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
              >
                <Download size={18} />
                Tải xuống
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
