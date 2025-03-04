import axios from "axios";
import { config } from "@/config.js";

let baseURL = config.SSL ? config.apiUrl : `${config.apiUrl}/unsecure`;

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      (!error.request.responseURL.includes("login") ||
        !error.request.responseURL.includes("signup"))
    ) {
      if (!error.request.responseURL.includes("signup")) {
        try {
          const { refreshAccessToken } = useAuthService();
          await refreshAccessToken();
          return apiClient.request(error.config);
        } catch (refreshError) {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);
export default apiClient;
