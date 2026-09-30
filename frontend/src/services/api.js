import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const submitEnquiry = (data) => api.post("/enquiries", data);

export const submitContactMessage = (data) => api.post("/contact", data);

export default api;