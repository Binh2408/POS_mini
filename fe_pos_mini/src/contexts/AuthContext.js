import { createContext, useContext, useEffect, useState } from "react";
import api from '../contexts/api';
const AuthContext = createContext();
const URL = "/auth";
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // const navigate = useNavigate();
    const fetchUser = async () => {
        try {
            const resp = await api.get(`${URL}/me`, {withCredentials: true});
            setUser(resp.data);
            setIsAuthenticated(true);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }
    const logout = async () => {
        try {
            await api.post(`${URL}/logout`, null, {withCredentials: true});
        } catch (error) {
            console.log(error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            document.cookie = 'jwt=; Max-Age=0; path=/;';
        }
    }
    useEffect(() => {
        fetchUser();
    }, []);
    return (
        <AuthContext.Provider value={{user, setUser, loading, fetchUser, logout, isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);