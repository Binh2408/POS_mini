// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children, roles }) {
  const { user } = useAuth();

  // ❌ Chưa đăng nhập → quay lại login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Không có quyền (role không nằm trong danh sách)
  if (roles && !roles.includes(user.role?.name)) {
    return <Navigate to="/pos" replace />; // staff chỉ quay về POS
  }

  // ✅ Được phép
  return children;
}
