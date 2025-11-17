import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import {
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProducts: 0,
    bestSellingProducts: [],
    lowStockProducts: [],
    revenueLast7Days : []
  });
  const [loading, setLoading] = useState(true);
  const selectedBranch = JSON.parse(localStorage.getItem("selected_branch") || "null");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/dashboard/${selectedBranch?.id}`,
        { withCredentials: true }
      );
      setStats(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải dữ liệu thống kê!");
    } finally {
      setLoading(false);
    }
  };

  // Format số tiền
  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />
        <main className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Bảng Điều Khiển
            </h1>
            <p className="text-gray-600 mt-1">
              Theo dõi doanh thu, sản phẩm và tồn kho theo thời gian thực
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: "Tổng Doanh Thu Hôm Nay",
                value: loading ? "..." : formatCurrency(stats.totalRevenue),
                icon: DollarSign,
                color: "from-emerald-500 to-teal-600",
                bg: "bg-gradient-to-br",
              },
              {
                title: "Tổng Sản Phẩm",
                value: loading ? "..." : stats.totalProducts,
                icon: Package,
                color: "from-blue-500 to-indigo-600",
                bg: "bg-gradient-to-br",
              },
              {
                title: "Cảnh Báo Tồn Kho",
                value: loading ? "..." : stats.lowStockProducts.length,
                icon: AlertTriangle,
                color: "from-amber-500 to-orange-600",
                bg: "bg-gradient-to-br",
              },
              {
                title: "Sản Phẩm Bán Chạy",
                value: loading ? "..." : stats.bestSellingProducts.length,
                icon: TrendingUp,
                color: "from-purple-500 to-pink-600",
                bg: "bg-gradient-to-br",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`${card.bg} ${card.color} text-white p-6 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">{card.title}</p>
                    <p className="text-2xl font-bold mt-1">
                      {card.value}
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <card.icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          {/* <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Doanh Thu 7 Ngày Gần Nhất
              </h2>
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Đang tải biểu đồ...</div>
              </div>
            ) : stats.revenueLast7Days.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={stats.revenueLast7Days} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}tr`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value) => formatCurrency(value)}
                    labelStyle={{ color: "#1f2937", fontWeight: "600" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="url(#colorGradient)"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#6366f1" }}
                    activeDot={{ r: 7 }}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <p>Chưa có dữ liệu doanh thu</p>
             : false
              </div>
            )}
          </div> */}

          {/* Bottom Section: Top Products & Low Stock */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Selling Products */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Top Sản Phẩm Bán Chạy
                </h2>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : stats.bestSellingProducts.length > 0 ? (
                <div className="space-y-3">
                  {stats.bestSellingProducts.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                          {idx + 1}
                        </div>
                        <span className="font-medium text-gray-800">
                          {item.productName}
                        </span>
                      </div>
                      <span className="font-semibold text-purple-600">
                        {item.quantitySold}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-6">
                  Chưa có sản phẩm bán chạy
                </p>
              )}
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Cảnh Báo Tồn Kho Thấp
                </h2>
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                      <div className="h-6 bg-red-200 rounded-full w-12 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : stats.lowStockProducts.length > 0 ? (
                <div className="space-y-3">
                  {stats.lowStockProducts.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-red-50 transition-colors border-l-4 border-red-400"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Mức cảnh báo: {item.reorderLevel}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full">
                          {item.stock}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-green-600 py-6 font-medium">
                  Tất cả sản phẩm đều đủ hàng!
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}