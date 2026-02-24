import axios from "axios";
import { refresh } from "./auth";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ← dynamic,
});

/* attach access token */
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* auto refresh on 401 */
instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await refresh(refreshToken);

        localStorage.setItem("accessToken", res.data.accessToken);

        original.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return instance(original);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default instance;