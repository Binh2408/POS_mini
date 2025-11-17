import React from "react";
import { X, CheckCircle, XCircle, FileText, Printer } from "lucide-react";

export default function InvoiceModal({ invoice, onCancel, onConfirm }) {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-3">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full">
              <FileText className="text-green-600" size={26} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Hóa đơn bán hàng</h2>
              <p className="text-green-100 text-sm">Mã: {invoice.code}</p>
            </div>
          </div>
          <button
            onClick={() => onCancel(invoice.code)}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nội dung chính - Layout 2 cột */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cột trái - Thông tin hóa đơn (2/3 width) */}
            <div className="lg:col-span-2 space-y-5">
              {/* Thông tin khách hàng */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Khách hàng</p>
                  <p className="font-semibold text-gray-800">
                    {invoice.customer?.name || "Khách lẻ"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Thu ngân</p>
                  <p className="font-semibold text-gray-800">
                    {invoice.cashier?.fullName}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Ngày tạo</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(invoice.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-blue-500 rounded"></span>
                  Chi tiết sản phẩm
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-600">
                          Sản phẩm
                        </th>
                        <th className="text-center p-3 font-semibold text-gray-600">
                          SL
                        </th>
                        <th className="text-right p-3 font-semibold text-gray-600">
                          Đơn giá
                        </th>
                        <th className="text-right p-3 font-semibold text-gray-600">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {invoice.details?.map((d, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="p-3 text-gray-800">
                            {d.product?.name}
                          </td>
                          <td className="p-3 text-center font-semibold text-gray-800">
                            {d.quantity}
                          </td>
                          <td className="p-3 text-right text-gray-600">
                            {d.unitPrice.toLocaleString("vi-VN")}₫
                          </td>
                          <td className="p-3 text-right font-semibold text-gray-800">
                            {d.subtotal.toLocaleString("vi-VN")}₫
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tổng cộng */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Tổng:</span>
                  <span className="font-semibold text-gray-800">
                    {invoice.totalAmount.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Giảm giá:</span>
                  <span className="font-semibold text-gray-800">
                    {invoice.discount.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-gray-300">
                  <span className="font-bold text-gray-800">
                    Cần thanh toán:
                  </span>
                  <span className="font-bold text-blue-600">
                    {invoice.finalAmount.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>
            </div>

            {/* Cột phải - QR Code và Actions (1/3 width) */}
            <div className="lg:col-span-1 space-y-4">
              {/* QR Code */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
                <h3 className="font-bold text-gray-800 mb-3 text-center">
                  Quét mã thanh toán
                </h3>
                <div className="flex justify-center">
                  <img
                    src={invoice.qrUrl}
                    alt="Mã QR thanh toán"
                    className="w-full max-w-[200px] h-auto border-4 border-white rounded-xl shadow-lg"
                  />
                </div>
                <p className="text-xs text-gray-600 text-center mt-3">
                  Quét mã QR để thanh toán nhanh
                </p>
              </div>

              {/* Nút hành động */}
              <div className="space-y-3">
                <button
                  onClick={onConfirm}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <CheckCircle size={20} />
                  Xác nhận thanh toán
                </button>

                <button
                  onClick={() => onCancel(invoice.code)}
                  className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <XCircle size={20} />
                  Hủy hóa đơn
                </button>

                <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Printer size={20} />
                  In hóa đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
