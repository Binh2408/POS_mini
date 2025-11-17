import api from "../contexts/api";

const URL = `/categories`;

const getAllCategories = async () => {
    try {
        const response = await api.get(URL, {withCredentials: true});
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách thể loại: " + error);
        throw error;
    }
}

export default {getAllCategories};