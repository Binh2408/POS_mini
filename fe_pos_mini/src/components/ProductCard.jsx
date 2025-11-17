import React from "react";
import { Plus, Package } from "lucide-react";

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100 flex flex-col">
      {/* Hình ảnh sản phẩm */}
      <div className="relative overflow-hidden h-40 bg-gray-100">
        <img
          src={product.imageUrl || product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400";
          }}
        />

        {/* Số lượng tồn */}
        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm flex items-center gap-1">
          <Package size={12} />
          {product.stock ?? 0}
        </div>

        {/* Danh mục sản phẩm */}
        {product.category.name && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow">
            {product.category.name}
          </div>
        )}
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {product.price?.toLocaleString("vi-VN")}₫
          </p>
          {product.barcode && (
            <p className="text-xs text-gray-400 mt-1">#{product.barcode}</p>
          )}
        </div>

        {/* Nút thêm vào giỏ */}
        <button
          onClick={() => onAdd(product)}
          className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg 
                     hover:from-blue-600 hover:to-blue-700 transition-all duration-200 
                     shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 
                     flex items-center justify-center gap-2 font-semibold"
        >
          <Plus size={20} />
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
