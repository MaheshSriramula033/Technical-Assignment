import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi, refresh as refreshApi } from "../api/auth";
import axios from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------- login ---------- */
  const login = async (credentials) => {
    const res = await loginApi(credentials);

    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setUser(res.data.user);
    navigate("/dashboard");
  };

  /* ---------- logout ---------- */
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        await axios.post("/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.log("Logout API failed but continuing");
    }

    // clear everything
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login", { replace: true });
  };

  /* ---------- refresh token ---------- */
  const refreshTokenFn = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return logout();

    try {
      const res = await refreshApi(refreshToken);
      localStorage.setItem("accessToken", res.data.accessToken);
    } catch {
      logout();
    }
  };

  /* ---------- auto login on reload ---------- */
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      setLoading(false);
      return;
    }

    setUser(JSON.parse(savedUser));

    refreshTokenFn().finally(() => setLoading(false));
  }, []);

  /* ---------- silent refresh every 8 minutes ---------- */
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      refreshTokenFn();
    }, 8 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};