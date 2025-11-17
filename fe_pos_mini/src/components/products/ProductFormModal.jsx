import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Package,
  DollarSign,
  Barcode,
  Image as ImageIcon,
  Tag,
} from "lucide-react";
import categoryService from "../../service/categoryService";

const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  mode = "create",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    costPrice: "",
    stock: "",
    reorderLevel: "",
    barcode: "",
    barcodeImageUrl: "",
    imageUrl: "",
    category: { name: "" },
    storeId: "",
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (isOpen) {
      categoryService
        .getAllCategories()
        .then((data) => setCategories(data))
        .catch((err) => console.error("Không thể tải danh mục:", err));
    }
  }, [isOpen]);
  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        costPrice: product.costPrice || "",
        stock: product.stock || "",
        reorderLevel: product.reorderLevel || "",
        barcode: product.barcode || "",
        barcodeImageUrl: product.barcodeImageUrl || "",
        imageUrl: product.imageUrl || "",
        category: product.category || { name: "" },
        storeId: product.storeId || "",
      });
    } else {
      const branch = JSON.parse(
        localStorage.getItem("selected_branch") || '{"id": 1}'
      );
      setFormData({
        name: "",
        price: "",
        costPrice: "",
        stock: "",
        reorderLevel: "",
        barcode: "",
        imageUrl: "",
        barcodeImageUrl: "",
        category: { name: "" },
        storeId: branch.id,
      });
    }
    setErrors({});
  }, [product, mode, isOpen]);
const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selected = categories.find((c) => c.id === Number(selectedId));
    setFormData((prev) => ({
      ...prev,
      category: selected || { id: "", name: "" },
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Tên sản phẩm không được để trống";
    if (!formData.costPrice || formData.costPrice <= 0)
      newErrors.costPrice = "Giá gốc phải lớn hơn 0";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Giá bán phải lớn hơn 0";
    if (
      formData.price &&
      formData.costPrice &&
      parseFloat(formData.price) < parseFloat(formData.costPrice) * 1.03
    )
      newErrors.price = `Giá bán phải cao hơn giá gốc ít nhất 3% (${(
        parseFloat(formData.costPrice) * 1.03
      ).toFixed(0)})`;

    if (!formData.stock && formData.stock !== 0)
      newErrors.stock = "Số lượng không được để trống";
    else if (formData.stock < 0) newErrors.stock = "Số lượng không được âm";
    else if (formData.stock > 0 && formData.stock < 10)
      newErrors.stock = "Cảnh báo: số lượng tồn kho thấp hơn 10";

    // if (!formData.barcode.trim()) newErrors.barcode = "Mã vạch không được để trống";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      costPrice: parseFloat(formData.costPrice),
      stock: parseInt(formData.stock),
      storeId: parseInt(formData.storeId),
    };

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full">
                <Package className="text-blue-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {mode === "create" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
                </h2>
                <p className="text-blue-100 text-sm">
                  {mode === "create"
                    ? "Nhập thông tin sản phẩm"
                    : "Cập nhật thông tin sản phẩm"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto max-h-[70vh]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tên sản phẩm */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Package size={16} />
                  Tên sản phẩm <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập tên sản phẩm"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Giá gốc */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <DollarSign size={16} />
                  Giá gốc <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.costPrice ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0"
                min="0"
                step="1000"
              />
              {errors.costPrice && <p className="text-red-500 text-sm mt-1">{errors.costPrice}</p>}
            </div>

            {/* Giá bán */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <DollarSign size={16} />
                  Giá bán <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0"
                min="0"
                step="1000"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            {/* Số lượng tồn kho */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Package size={16} />
                  Số lượng tồn kho <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.stock ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0"
                min="0"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>

            {/* Mức cảnh báo tồn kho */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Package size={16} /> Mức cảnh báo tồn kho
                </span>
              </label>
              <input
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>

            {/* Mã vạch */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Barcode size={16} /> Mã vạch
                </span>
              </label>
              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="Nhập mã vạch"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.barcode ? "border-red-500" : "border-gray-300"
                }`}
                readOnly={mode === "edit"}
              />
              {errors.barcode && <p className="text-red-500 text-sm mt-1">{errors.barcode}</p>}
            </div>

            {/* Danh mục */}
            <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Tag size={16} /> Danh mục <span className="text-red-500">*</span>
              </span>
            </label>
            <select
              value={formData.category?.id || ""}
              onChange={handleCategoryChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
              disabled={mode === "edit"} // 🟢 có thể tắt khi chỉnh sửa nếu bạn muốn
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>
          </div>

          {/* Ảnh sản phẩm */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <ImageIcon size={16} /> Ảnh sản phẩm
              </span>
            </label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {formData.imageUrl && (
              <div className="mt-3">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200";
                  }}
                />
              </div>
            )}
          </div>

          {/* Ảnh mã vạch */}
          {product?.barcodeImageUrl && (
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Barcode size={16} /> Ảnh mã vạch
                </span>
              </label>
              <img
                src={product.barcodeImageUrl}
                alt="Barcode"
                className="w-32 h-32 object-contain rounded-lg border-2 border-gray-200 mb-2"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {mode === "create" ? "Thêm sản phẩm" : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
