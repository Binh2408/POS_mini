import api from "../contexts/api";

const URL = `/customers`;

const getCustomerByNameOrPhone = async (storeId, keyword) => {
  try {
    const res = await api.get(`${URL}/search`, {
      params: { storeId, keyword },
    }, {withCredentials: true});
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm khách hàng: " + error);
    return [];
  }
};

export default { getCustomerByNameOrPhone };
