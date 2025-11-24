import api from "../contexts/api";

const URL = `/products`;

const getProductsByStore = async (storeId, page = 0, size = 10, sortBy = "id", sortDir = "asc", keyword = "") => {
  try {
    const params = new URLSearchParams({
      page,
      size,
      sortBy,
      sortDir,
    });
    if (keyword) params.append("keyword", keyword);

    const res = await api.get(`${URL}/store/${storeId}?${params.toString()}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm: " + error);
    return { content: [], totalElements: 0, totalPages: 0 };
  }
};

const getProductByBarcode = async (storeId, barcode) => {
  try {
    const res = await api.get(`/products/store/${storeId}/barcode/${barcode}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Không tìm thấy sản phẩm với mã vạch: " + barcode);
    return null;
  }
};

const createProduct = async (storeId, data) => {
  try {
    const formData = new FormData();

    // File
    if (data.imageFile) {
      formData.append("imageFile", data.imageFile);
    }

    // JSON của product
    const productData = { ...data };
    delete productData.imageFile;

    formData.append(
      "product",
      new Blob([JSON.stringify(productData)], { type: "application/json" })
    );

    const res = await api.post(`${URL}/store/${storeId}`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm: ", error);
    throw error;
  }
};


const getProductById = async (storeId, id) => {
  try {
    const response = await api.get(`${URL}/${storeId}/${id}`, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Không tìm thấy sản phẩm: " + error);
    throw error;
  }
}

const updateProduct = async (storeId, id, data) => {
  try {
    const formData = new FormData();

    // Nếu có file ảnh mới
    if (data.imageFile) {
      formData.append("imageFile", data.imageFile);
    }

    // Xóa imageFile khỏi JSON
    const productData = { ...data };
    delete productData.imageFile;

    // Gửi JSON dạng Blob
    formData.append(
      "product",
      new Blob([JSON.stringify(productData)], { type: "application/json" })
    );

    const res = await api.put(
      `${URL}/store/${storeId}/${id}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Lỗi cập nhật sản phẩm: ", error);
    throw error;
  }
};


const deleteProduct = async (storeId, id) => {
  try {
    const response = await api.delete(`${URL}/${storeId}/${id}`, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm: " + error);
    throw error;
  }
}

export default {
  getProductsByStore,
  getProductByBarcode,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
};


