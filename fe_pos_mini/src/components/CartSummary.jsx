import React from "react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  CheckCircle,
} from "lucide-react";

export default function CartSummary({
  cart,
  onRemove,
  onCheckout,
  onUpdateQty,
  onConfirmPaid,
  invoiceCode,
}) {
  const total = cart.reduce((s, it) => s + it.price * (it.qty || 1), 0);
  const itemCount = cart.reduce((s, it) => s + (it.qty || 1), 0);

  const increaseQty = (idx) => onUpdateQty(idx, (cart[idx].qty || 1) + 1);
  const decreaseQty = (idx) => {
    const newQty = (cart[idx].qty || 1) - 1;
    if (newQty >= 1) onUpdateQty(idx, newQty);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingCart className="text-blue-600" size={24} />
          Giỏ hàng
        </h3>
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
          {itemCount} món
        </span>
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-96">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">Giỏ hàng trống</p>
          </div>
        ) : (
          cart.map((it, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start gap-3">
                <img
                  src={
                    it.imageUrl ||
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100"
                  }
                  alt={it.name}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100";
                  }}
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">
                    {it.name}
                  </h4>
                  <p className="text-blue-600 font-bold text-sm mt-1">
                    {it.price.toLocaleString("vi-VN")}₫
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQty(idx)}
                      className="bg-white border border-gray-300 p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={14} />
                    </button>

                    <input
                      type="number"
                      value={it.qty || 1}
                      onChange={(e) =>
                        onUpdateQty(idx, parseInt(e.target.value) || 1)
                      }
                      className="w-12 text-center border border-gray-300 rounded py-1 text-sm font-semibold"
                      min="1"
                    />

                    <button
                      onClick={() => increaseQty(idx)}
                      className="bg-white border border-gray-300 p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={14} />
                    </button>

                    <button
                      onClick={() => onRemove(idx)}
                      className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-right mt-2 pt-2 border-t border-gray-200">
                <span className="text-sm text-gray-500">Thành tiền: </span>
                <span className="font-bold text-gray-800">
                  {(it.price * (it.qty || 1)).toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Total + Actions */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Tạm tính:</span>
          <span className="font-semibold text-gray-800">
            {total.toLocaleString("vi-VN")}₫
          </span>
        </div>

        <div className="flex justify-between items-center text-lg">
          <span className="font-bold text-gray-800">Tổng cộng:</span>
          <span className="font-bold text-blue-600 text-2xl">
            {total.toLocaleString("vi-VN")}₫
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            onClick={onCheckout}
            disabled={cart.length === 0}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow hover:shadow-md transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CreditCard size={20} />
            Thanh toán
          </button>

          {invoiceCode ? (
            <button
              onClick={() => onConfirmPaid(invoiceCode)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow hover:shadow-md transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Xác nhận
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-gray-200 text-gray-500 py-3 rounded-lg font-bold text-lg cursor-not-allowed flex items-center justify-center gap-2"
            >
              Lưu tạm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
