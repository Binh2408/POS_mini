import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Bar, Line, Pie } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [profitData, setProfitData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [activeTab, setActiveTab] = useState("revenue-profit"); // Tab mặc định
  const [loading, setLoading] = useState(true);
  const branch = JSON.parse(localStorage.getItem("selected_branch") || "null"); // tạm thời cố định

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, revenueRes, profitRes, categoryRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/reports/summary?storeId=${branch?.id}`, { withCredentials: true }),
          axios.get(`http://localhost:8080/api/reports/monthly-revenue?storeId=${branch?.id}`, { withCredentials: true }),
          axios.get(`http://localhost:8080/api/reports/monthly-profit?storeId=${branch?.id}`, { withCredentials: true }),
          axios.get(`http://localhost:8080/api/reports/category-revenue-percent?storeId=${branch?.id}`, { withCredentials: true }),
        ]);

        setSummary(summaryRes.data[0]);
        setRevenueData(revenueRes.data);
        setProfitData(profitRes.data);
        setCategoryData(categoryRes.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu báo cáo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [branch?.id]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Đang tải dữ liệu...</div>;
  }

  // Gộp doanh thu & lợi nhuận
  const labels = revenueData.map((r) => `Th${r.month}/${r.year}`);
  const revenueValues = revenueData.map((r) => r.monthlyRevenue);
  const profitValues = profitData.map((p) => p.totalProfit);

  const barData = {
    labels,
    datasets: [
      {
        label: "Doanh thu (₫)",
        data: revenueValues,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Lợi nhuận (₫)",
        data: profitValues,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const lineData = {
    labels,
    datasets: [
      {
        label: "Doanh thu (₫)",
        data: revenueValues,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.3,
      },
      {
        label: "Lợi nhuận (₫)",
        data: profitValues,
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.3,
      },
    ],
  };

  // Biểu đồ tròn danh mục
  const categoryLabels = categoryData.map((c) => c.categoryName);
  const categoryValues = categoryData.map((c) => c.totalRevenue);
  const pieData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Doanh thu theo danh mục (₫)",
        data: categoryValues,
        backgroundColor: [
          "#4CAF50",
          "#FF9800",
          "#03A9F4",
          "#E91E63",
          "#9C27B0",
          "#FFC107",
          "#009688",
        ],
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            `${ctx.label}: ${ctx.raw.toLocaleString("vi-VN")} ₫`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toLocaleString("vi-VN") + " ₫",
        },
      },
    },
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            Báo cáo chi nhánh {summary?.storeName}
          </h1>

          {/* Tổng hợp */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <h2 className="text-gray-500 text-sm">Tổng hóa đơn</h2>
              <p className="text-2xl font-bold">{summary?.totalInvoices}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <h2 className="text-gray-500 text-sm">Tổng doanh thu</h2>
              <p className="text-2xl font-bold text-green-600">
                {summary?.totalRevenue.toLocaleString("vi-VN")} ₫
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <h2 className="text-gray-500 text-sm">Tổng lợi nhuận</h2>
              <p className="text-2xl font-bold text-blue-600">
                {summary?.totalProfit.toLocaleString("vi-VN")} ₫
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("revenue-profit")}
                className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all ${
                  activeTab === "revenue-profit"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Doanh thu & Lợi nhuận
              </button>
              <button
                onClick={() => setActiveTab("category")}
                className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all ${
                  activeTab === "category"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Theo danh mục
              </button>
              {/* <button
                onClick={() => setActiveTab("product")}
                className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all ${
                  activeTab === "product"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Sản phẩm
              </button>
              <button
                onClick={() => setActiveTab("transaction")}
                className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all ${
                  activeTab === "transaction"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Giao dịch
              </button> */}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Tab: Doanh thu & Lợi nhuận */}
              {activeTab === "revenue-profit" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">
                      Biểu đồ doanh thu & lợi nhuận theo tháng
                    </h2>
                    <Bar data={barData} options={commonOptions} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mb-4">
                      Xu hướng tăng/giảm doanh thu và lợi nhuận
                    </h2>
                    <Line data={lineData} options={commonOptions} />
                  </div>
                </div>
              )}

              {/* Tab: Theo danh mục */}
              {activeTab === "category" && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">
                      Tỷ lệ doanh thu theo danh mục
                    </h2>
                    <Pie data={pieData} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mb-4">
                      Chi tiết doanh thu danh mục
                    </h2>
                    <table className="w-full border-collapse border text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border px-3 py-2">Danh mục</th>
                          <th className="border px-3 py-2 text-right">Doanh thu</th>
                          <th className="border px-3 py-2 text-right">Tỷ lệ (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryData.map((c) => (
                          <tr key={c.categoryId}>
                            <td className="border px-3 py-2">{c.categoryName}</td>
                            <td className="border px-3 py-2 text-right">
                              {c.totalRevenue.toLocaleString("vi-VN")} ₫
                            </td>
                            <td className="border px-3 py-2 text-right">
                              {c.revenuePercent}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab: Sản phẩm (Placeholder) */}
              {activeTab === "product" && (
                <div className="text-center py-10 text-gray-500">
                  <p>Biểu đồ và bảng thống kê sản phẩm sẽ được hiển thị ở đây.</p>
                  <p className="text-sm mt-2">(Chưa có API)</p>
                </div>
              )}

              {/* Tab: Giao dịch (Placeholder) */}
              {activeTab === "transaction" && (
                <div className="text-center py-10 text-gray-500">
                  <p>Lịch sử giao dịch và biểu đồ sẽ được hiển thị ở đây.</p>
                  <p className="text-sm mt-2">(Chưa có API)</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}