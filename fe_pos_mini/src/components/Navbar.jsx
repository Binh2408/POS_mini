import React, { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { authService } from "../service/authService";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentBranch, setCurrentBranch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Lấy chi nhánh đang chọn từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("selected_branch");
    if (saved) {
      setCurrentBranch(JSON.parse(saved));
    }
  }, []);

  const handleLogout = async () => {
  try {
    await authService.logout();
    localStorage.removeItem("pos_user");
    localStorage.removeItem("selected_branch");
    toast.success("Đã đăng xuất!");
    setTimeout(() => navigate("/login"), 1000);
  } catch (err) {
    console.error("Logout failed:", err);
    toast.error("Lỗi khi đăng xuất!");
  }
};

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const confirmLogout = () => {
    handleLogout();
    closeModal();
  };

  return (
    <>
      <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
        <div>
          <div className="text-gray-700 font-semibold">
            Xin chào, {user?.name || "Người dùng"} 👋
          </div>
          {currentBranch && (
            
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {currentBranch.name}
          </p>
          )}
        </div>

        <button
          onClick={openModal}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 transition"
        >
          <LogOut size={16} /> Đăng xuất
        </button>
      </header>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Xác nhận đăng xuất
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn đăng xuất không?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Hủy
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}