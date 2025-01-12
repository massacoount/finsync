import axios from "axios";

const httpClient = axios.create({
  baseURL: process.env.VITE_API_URL || "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { httpClient };
