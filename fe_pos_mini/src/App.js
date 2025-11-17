import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Products from "./pages/Products";
import Invoices from "./pages/Invoices";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import BranchSelect from "./pages/BranchSelect";
import StaffManagement from "./pages/StaffManagement";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Trang gốc */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <HomeRedirect />
          </RequireAuth>
        }
      />

      <Route
        path="/branch-select"
        element={
          <RequireAuth>
            <BranchSelect />
          </RequireAuth>
        }
      />

      {/* Chặn admin truy cập POS */}
      <Route
        path="/pos"
        element={
          <RequireAuth allowedRoles={["STAFF"]}>
            <POS />
          </RequireAuth>
        }
      />

      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/products"
        element={
          <RequireAuth>
            <Products />
          </RequireAuth>
        }
      />
      <Route
        path="/invoices"
        element={
          <RequireAuth>
            <Invoices />
          </RequireAuth>
        }
      />
      <Route
        path="/customers"
        element={
          <RequireAuth>
            <Customers />
          </RequireAuth>
        }
      />
      <Route
        path="/reports"
        element={
          <RequireAuth>
            <Reports />
          </RequireAuth>
        }
      />
      <Route
        path="/managers"
        element={
          <RequireAuth>
            <StaffManagement />
          </RequireAuth>
        }
      />

      {/* Mặc định */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// 🧩 Kiểm tra đăng nhập & quyền
function RequireAuth({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("pos_user") || "null");

  if (!user) return <Navigate to="/login" replace />;

  // Nếu có truyền quyền mà user không thuộc quyền cho phép → chặn
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// ✅ Logic điều hướng sau khi login
function HomeRedirect() {
  const user = JSON.parse(localStorage.getItem("pos_user") || "null");
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "admin") return <Navigate to="/branch-select" replace />;
  else return <Navigate to="/pos" replace />;
}
