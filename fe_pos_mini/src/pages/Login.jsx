import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../service/authService";
import { useAuth } from "../contexts/AuthContext";
import { Lock, User } from "lucide-react"; // Thêm icon từ lucide-react
import storeService from "../service/storeService";

export default function Login() {
  const { fetchUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login(username, password);
      console.log("Login response:", res);

      const { id, username: name, role } = res;
      localStorage.setItem(
        "pos_user",
        JSON.stringify({ id, username: name, role })
      );
      fetchUser();

      // 🔹 Nếu không phải admin thì fetch store ngay
      if (!role?.toUpperCase().includes("ADMIN")) {
        try {
          const storeData = await storeService.getStoreById(id);
          if (!storeData) throw new Error("Không lấy được chi nhánh");
          localStorage.setItem("selected_branch", JSON.stringify(storeData));
          console.log("Selected branch for user:", storeData);
        } catch (err) {
          console.error("Lỗi fetch store:", err);
          toast.error("Không xác định được chi nhánh của bạn");
        }
      }

      toast.success("Đăng nhập thành công!");

      if (role?.toUpperCase().includes("ADMIN")) navigate("/branch-select");
      else navigate("/pos");
    } catch (err) {
      toast.error(err.message || "Sai tài khoản hoặc mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-[1.02]">
        {/* Logo or Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-800 tracking-tight">
            Đăng nhập POS
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Vui lòng nhập thông tin đăng nhập của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div className="relative">
            <label className="block text-gray-600 text-sm font-medium mb-2">
              Tên đăng nhập
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block text-gray-600 text-sm font-medium mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Quên mật khẩu?
          </a>
        </div>
      </div>
    </div>
  );
}
