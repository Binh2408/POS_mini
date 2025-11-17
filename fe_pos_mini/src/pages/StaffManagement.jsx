import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Lock,
} from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// Validation Schema
const StaffSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Tên đăng nhập ít nhất 3 ký tự")
    .max(20, "Tên đăng nhập tối đa 20 ký tự")
    .required("Vui lòng nhập tên đăng nhập"),
  password: Yup.string().when("isEditing", {
    is: false,
    then: (schema) =>
      schema
        .min(6, "Mật khẩu ít nhất 6 ký tự")
        .required("Vui lòng nhập mật khẩu"),
    otherwise: (schema) => schema.min(6, "Mật khẩu ít nhất 6 ký tự").optional(),
  }),
  fullName: Yup.string()
    .min(2, "Họ tên ít nhất 2 ký tự")
    .required("Vui lòng nhập họ tên"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số")
    .required("Vui lòng nhập số điện thoại"),
});

const StaffManagement = () => {
  const [staffs, setStaffs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 6;
  const branch = JSON.parse(
    localStorage.getItem("selected_branch") || '{"id":1,"name":"Chi nhánh 1"}'
  );

  // Load danh sách nhân viên
  useEffect(() => {
    setCurrentPage(1);
    fetchStaffs(0, searchTerm);
  }, [branch?.id]);

  const fetchStaffs = async (page = 0, keyword = "") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/staffs/store/${branch?.id}`,
        {
          params: { page, size: itemsPerPage, keyword },
          withCredentials: true,
        }
      );

      setStaffs(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách nhân viên");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (staff = null) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editingStaff) {
        const updateData = { ...values };
        if (!updateData.password) delete updateData.password;
        await axios.put(
          `http://localhost:8080/api/staffs/${editingStaff.id}`,
          updateData,
          { withCredentials: true }
        );
        toast.success("Cập nhật nhân viên thành công");
      } else {
        await axios.post(
          `http://localhost:8080/api/staffs/store/${branch?.id}`,
          values,
          { withCredentials: true }
        );
        toast.success("Thêm nhân viên thành công");
      }
      closeModal();
      fetchStaffs(currentPage - 1, searchTerm);
    } catch (error) {
      // Lấy message user-friendly
    const message =
      error.response?.data?.error || // BE trả về
      error.response?.data?.message || 
      error.message || 
      'Có lỗi xảy ra';

    toast.error(message);

    // Optional: log nhẹ cho dev
    console.warn('Staff submit error:', message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa nhân viên này?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/staffs/${id}`, {
        withCredentials: true,
      });
      toast.success("Xóa nhân viên thành công");
      fetchStaffs(currentPage - 1, searchTerm);
    } catch (error) {
      toast.error("Xóa thất bại");
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStaffs(0, searchTerm);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage + 1);
    fetchStaffs(newPage, searchTerm);
  };

  return (
    <>
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-y-auto">
          <Navbar />

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <User className="text-blue-600" />
                  Quản Lý Nhân Viên
                </h1>
                <p className="text-sm text-gray-500">
                  Chi nhánh: <strong>{branch?.name}</strong>
                </p>
              </div>

              {/* Thanh tìm kiếm + nút thêm */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <form
                  onSubmit={handleSearch}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <div className="relative flex-1">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all"
                  >
                    <Search size={20} />
                    Tìm kiếm
                  </button>

                  <button
                    type="button"
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all"
                  >
                    <Plus size={20} />
                    Thêm Nhân Viên
                  </button>
                </form>
              </div>

              {/* Danh sách nhân viên */}
              <div className="bg-white rounded-xl shadow-md p-6">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-16 bg-gray-200 rounded-lg animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : staffs.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <User size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>Không tìm thấy nhân viên nào</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {staffs.map((staff) => (
                        <div
                          key={staff.id}
                          className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800">
                                {staff.fullName}
                              </h3>
                              <p className="text-xs text-gray-500">
                                @{staff.username}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => openModal(staff)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(staff.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail size={14} />
                              <span className="truncate">{staff.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone size={14} />
                              <span>{staff.phone}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Phân trang */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-4 pt-4 border-t">
                        <button
                          onClick={() => handlePageChange(currentPage - 2)}
                          disabled={currentPage === 1}
                          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronLeft size={20} />
                          Trước
                        </button>
                        <span className="font-semibold text-gray-700">
                          Trang {currentPage} / {totalPages}
                        </span>
                        <button
                          onClick={() => handlePageChange(currentPage)}
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                          Sau
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <User className="text-blue-600" />
                {editingStaff ? "Chỉnh Sửa Nhân Viên" : "Thêm Nhân Viên Mới"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={22} />
              </button>
            </div>

            <Formik
              initialValues={{
                username: editingStaff?.username || "",
                password: "",
                fullName: editingStaff?.fullName || "",
                email: editingStaff?.email || "",
                phone: editingStaff?.phone || "",
                isEditing: !!editingStaff,
              }}
              validationSchema={StaffSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                      <Lock size={16} /> Tên đăng nhập
                    </label>
                    <Field
                      type="text"
                      name="username"
                      disabled={!!editingStaff}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-100"
                      placeholder="Nhập tên đăng nhập"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                      <Lock size={16} /> Mật khẩu{" "}
                      {editingStaff && "(Để trống nếu không đổi)"}
                    </label>
                    <Field
                      type="password"
                      name="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder={editingStaff ? "••••••••" : "Nhập mật khẩu"}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                      <User size={16} /> Họ và tên
                    </label>
                    <Field
                      type="text"
                      name="fullName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Nhập họ tên"
                    />
                    <ErrorMessage
                      name="fullName"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                      <Mail size={16} /> Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="example@domain.com"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                      <Phone size={16} /> Số điện thoại
                    </label>
                    <Field
                      type="text"
                      name="phone"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="0123456789"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                    >
                      {isSubmitting
                        ? "Đang xử lý..."
                        : editingStaff
                        ? "Cập Nhật"
                        : "Thêm Mới"}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                    >
                      Hủy
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default StaffManagement;
