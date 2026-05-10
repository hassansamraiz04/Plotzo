import axios from "axios";

const apiRequest = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8800/api",
  withCredentials: true,
});

apiRequest.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return config;

    const user = JSON.parse(raw);
    const token = user?.token;
    if (token) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // Ignore malformed storage and continue request.
  }
  return config;
});

export default apiRequest;
