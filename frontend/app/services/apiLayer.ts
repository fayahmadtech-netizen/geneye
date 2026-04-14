import axios from "axios";

// Automatically use the public NEXT env var, fallback to localhost:8000 for backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to automatically attach JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    // We only access localStorage on the client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Interceptor to handle global 401 Unauthorized errors (e.g. redirect to login)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // We will handle redirect in the auth context, but we could clear state here
      }
    }
    return Promise.reject(error);
  }
);
