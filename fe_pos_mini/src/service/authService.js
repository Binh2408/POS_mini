// src/service/authService.js
import api from "../contexts/api";

export const authService = {
  async login(username, password) {
    try {
      const res = await api.post("/auth/login", { username, password });
      return res.data; // trả về { username, role, message }
    } catch (err) {
      if (err.response?.status === 401) {
        throw new Error("Sai tài khoản hoặc mật khẩu!");
      }
      throw new Error("Lỗi khi đăng nhập!");
    }
  },

  async logout() {
    await api.post("/auth/logout");
  },

  async getCurrentUser() {
    const res = await api.get("/auth/me");
    return res.data;
  },
};
