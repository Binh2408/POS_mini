import api from "../contexts/api";

const URL = `/invoices`;

/**
 * Cập nhật trạng thái thanh toán (VD: PAID, UNPAID)
 */
const updateInvoiceStatus = async (code, status) => {
  try {
    const res = await api.put(`${URL}/${code}/status?status=${status}`, {}, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật trạng thái hóa đơn ${code}:`, error);
    return null;
  }
};

/**
 * Tạo mới hóa đơn
 * invoiceRequest: body
 * cashierId: giống Postman gửi
 */
const createInvoice = async (invoiceRequest, cashierId) => {
  try {
    const res = await api.post(`${URL}?cashierId=${cashierId}`, invoiceRequest, { withCredentials: true });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tạo hóa đơn:", error);
    throw error;
  }
};

const getAllInvoices = async () => {
  try {
    const res = await api.get(`${URL}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách hóa đơn:", error);
    throw error;
  }
}

export default { updateInvoiceStatus, createInvoice, getAllInvoices };
