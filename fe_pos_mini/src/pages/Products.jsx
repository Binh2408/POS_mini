import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import productService from "../service/productService";
import toast from "react-hot-toast";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Package,
  Barcode,
  Image as ImageIcon,
  RefreshCw
} from "lucide-react";
import ProductFormModal from "../components/products/ProductFormModal";
import DeleteConfirmModal from "../components/products/DeleteConfirmModal";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create"); // 'create' | 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const branch = useMemo(() => {
    return JSON.parse(localStorage.getItem("selected_branch") || '{"id": 1, "name": "Chi nhánh 1"}');
  }, []);

  const fetchProducts = async () => {
    if (!branch?.id) return;
    setIsLoading(true);
    try {
      const data = await productService.getProductsByStore(
        branch.id,
        page,
        size,
        "id",
        "asc",
        keyword
      );
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
      toast.error("Không thể tải danh sách sản phẩm!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [branch.id, page, keyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchProducts();
  };

  const handlePrevPage = () => setPage((prev) => Math.max(0, prev - 1));
  const handleNextPage = () => setPage((prev) => Math.min(totalPages - 1, prev + 1));

  // ======= CRUD handlers =======
  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setFormMode("edit");
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await productService.deleteProduct(branch.id, selectedProduct.id);
      toast.success(`Đã xóa sản phẩm: ${selectedProduct.name}`);
      setShowDelete(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Không thể xóa sản phẩm");
    }
  };

  const handleSubmitProduct = async (data) => {
    try {
      if (formMode === "create") {
        await productService.createProduct(branch.id, data);
        toast.success("Đã thêm sản phẩm mới!");
      } else {
        await productService.updateProduct(branch.id, selectedProduct.id, data);
        toast.success("Cập nhật sản phẩm thành công!");
      }
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Lưu sản phẩm thất bại!");
    }
  };

  // ======= UI =======
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />
        
        <main className="p-6 flex-1">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                    <Package className="text-white" size={28} />
                  </div>
                  Quản lý sản phẩm
                </h1>
                <p className="text-gray-500 mt-2">
                  {branch?.name || "Chi nhánh mặc định"} • {products.length} sản phẩm
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={fetchProducts}
                  className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <RefreshCw size={20} />
                </button>
                <button
                  onClick={handleOpenCreate}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <Plus size={20} />
                  Thêm sản phẩm
                </button>
              </div>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, mã vạch..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                Tìm kiếm
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Đang tải...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">Hình ảnh</th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">Thông tin sản phẩm</th>
                        <th className="p-4 text-center text-sm font-semibold text-gray-700">Giá bán</th>
                        <th className="p-4 text-center text-sm font-semibold text-gray-700">Tồn kho</th>
                        <th className="p-4 text-center text-sm font-semibold text-gray-700">Danh mục</th>
                        <th className="p-4 text-center text-sm font-semibold text-gray-700">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.length > 0 ? (
                        products.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                {p.imageUrl ? (
                                  <img
                                    src={p.imageUrl}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ImageIcon className="text-gray-400" size={24} />
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <p className="font-semibold text-gray-800">{p.name}</p>
                              {p.barcode && (
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                  <Barcode size={14} />
                                  {p.barcode}
                                </p>
                              )}
                            </td>
                            <td className="p-4 text-center font-bold text-blue-600">
                              {p.price?.toLocaleString('vi-VN')}₫
                            </td>
                            <td className="p-4 text-center">{p.stock}</td>
                            <td className="p-4 text-center">{p.category?.name || "-"}</td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={() => handleEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                  <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDelete(p)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="p-12 text-center text-gray-500">
                            Không có sản phẩm nào.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 p-6 border-t bg-gray-50">
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 0}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft size={20} />
                      Trước
                    </button>

                    <span className="font-semibold text-gray-700">
                      Trang {page + 1} / {totalPages}
                    </span>

                    <button
                      onClick={handleNextPage}
                      disabled={page >= totalPages - 1}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Sau
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modal thêm/sửa */}
      <ProductFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmitProduct}
        product={selectedProduct}
        mode={formMode}
      />

      {/* Modal xóa */}
      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleConfirmDelete}
        productName={selectedProduct?.name}
      />
    </div>
  );
}
