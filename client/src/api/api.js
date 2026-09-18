import axios from "axios";

// Determine base URL, handling Render URLs with or without trailing /api
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return "http://localhost:5000/api";
  }
  const cleanUrl = envUrl.trim().replace(/\/+$/, "");
  return cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
};

const API = axios.create({
  baseURL: getBaseUrl(),
  timeout: 45000, // 45s to accommodate Render free-tier cold starts
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for user-friendly error diagnostics
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        console.warn("⚠️ Request timed out. Cloud backend might be waking up from cold start.");
      } else {
        console.warn("⚠️ Network error: Backend API unreachable.", error.message);
      }
    }
    return Promise.reject(error);
  }
);

export default API;