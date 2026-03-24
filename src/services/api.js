import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// 🔥 TỰ ĐỘNG GẮN TOKEN ĐÚNG
api.interceptors.request.use((config) => {
  const url = config.url || "";

  // 👉 ADMIN API
  if (
    url.includes("/nhanvien") ||
    url.includes("/nxb") ||
    url.includes("/approve") ||
    url.includes("/reject")
  ) {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  // 👉 USER API
  else {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;