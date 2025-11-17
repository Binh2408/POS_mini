import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../service/authService";
import storeService from "../service/storeService";
import toast from "react-hot-toast";

export default function BranchSelect() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await storeService.findAllStore();
        setBranches(data);
      } catch (error) {
        toast.error("Không thể tải danh sách chi nhánh!");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const handleSelect = () => {
    if (!selected) {
      toast.error("Vui lòng chọn chi nhánh");
      return;
    }
    localStorage.setItem("selected_branch", JSON.stringify(selected));
    toast.success(`Đã chọn chi nhánh ${selected.name} thành công!`);
    navigate("/dashboard");
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem("pos_user");
      toast.success("Đã đăng xuất!");
      navigate("/login");
    } catch (err) {
      toast.error("Lỗi khi đăng xuất!");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-lg text-gray-700">Đang tải danh sách chi nhánh...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Chọn Chi Nhánh
        </h2>
        <div className="relative mb-6">
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-700 appearance-none"
            onChange={(e) =>
              setSelected(
                branches.find((b) => b.id === parseInt(e.target.value))
              )
            }
          >
            <option value="">-- Chọn chi nhánh --</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <button
          onClick={handleSelect}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 transform hover:-translate-y-1"
        >
          Vào Quản Lý
        </button>

        <button
          onClick={handleLogout}
          className="w-full mt-4 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition duration-200 transform hover:-translate-y-1"
        >
          Đăng Xuất
        </button>
      </div>
    </div>
  );
}