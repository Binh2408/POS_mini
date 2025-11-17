import api from "../contexts/api"

const URL = `/stores`

const findAllStore = async () => {
    try {
        const res = await api.get(URL, {withCredentials: true});
        return res.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách cửa hàng: " + error);
        return [];
    }
}

const getStoreById = async (id) => {
    try {
        const res = await api.get(`/users/${id}/store`, {withCredentials: true});
        return res.data;
    } catch (error) {
        console.log("Lỗi khi lấy chi nhánh theo user id: " + error)
        return null;
        
    }
}

export default {findAllStore, getStoreById};