import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Package, ShoppingCart, Users, BarChart2, Store, LayoutDashboard, FileText, UserCog, BarChart3 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const allItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pos", label: "Bán hàng", icon: ShoppingCart },
  { to: "/products", label: "Sản phẩm", icon: Package },
  { to: "/invoices", label: "Hóa đơn", icon: FileText },
  { to: "/reports", label: "Báo cáo", icon: BarChart3 },
  { to: "/managers", label: "Quản lý nhân viên", icon: UserCog },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  // Phân quyền menu (giữ nguyên logic)
  const filteredItems =
    user?.role?.name === "STAFF"
      ? allItems.filter((i) => ["/pos", "/invoices"].includes(i.to))
      : allItems.filter((i) => i.to !== "/pos");

  return (
    <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white flex flex-col shadow-2xl sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-blue-500">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg">
            <Store className="text-blue-600" size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold">POS Mini</h1>
            <p className="text-xs text-blue-200">Quản lý bán hàng</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-white text-blue-600 shadow-lg transform scale-105"
                      : "hover:bg-blue-700 hover:translate-x-1"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-500">
        <div className="bg-blue-700 rounded-lg p-3">
          <p className="text-xs text-blue-200">Phiên bản</p>
          <p className="font-semibold">v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
