import axios from "axios";

const SESSION_KEY = "akshara_session";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

export const storeSession = (token, expiresInSeconds) => {
  try {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ token, expiresAt: Date.now() + expiresInSeconds * 1000 })
    );
  } catch {
    // Storage unavailable: the user will simply need to sign in again.
  }
};

export const clearSession = () => {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing to clear.
  }
};

export const getStoredToken = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }
    const session = JSON.parse(raw);
    if (!session.token || session.expiresAt <= Date.now()) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session.token;
  } catch {
    return null;
  }
};

// Only these endpoints receive the token; public endpoints never do.
const needsAuth = (url = "") =>
  url.startsWith("/admin") ||
  url.startsWith("/student") ||
  url === "/auth/me" ||
  url === "/auth/change-password";

api.interceptors.request.use((config) => {
  if (needsAuth(config.url)) {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response && error.response.status;
    const url = error.config && error.config.url;
    if (status === 401 && needsAuth(url)) {
      clearSession();
      if (onUnauthorized) {
        onUnauthorized();
      }
    }
    return Promise.reject(error);
  }
);

// Public
export const submitEnquiry = (data) => api.post("/enquiries", data);
export const submitContactMessage = (data) => api.post("/contact", data);
export const getEvents = () => api.get("/events");
export const getGalleryItems = () => api.get("/gallery");

// Authentication
export const login = (username, password) =>
  api.post("/auth/login", { username, password });
export const getMe = () => api.get("/auth/me");
export const changePassword = (data) => api.post("/auth/change-password", data);

// Student
export const getStudentProfile = () => api.get("/student/profile");

// Admin: dashboard, enquiries, messages
export const getAdminSummary = () => api.get("/admin/summary");
export const getAdminEnquiries = () => api.get("/admin/enquiries");
export const updateEnquiryStatus = (id, status) =>
  api.patch(`/admin/enquiries/${id}/status`, { status });
export const getAdminMessages = () => api.get("/admin/contact-messages");
export const markMessageRead = (id) =>
  api.post(`/admin/contact-messages/${id}/read`);

// Admin: students
export const getAdminStudents = () => api.get("/admin/students");
export const createStudent = (data) => api.post("/admin/students", data);
export const updateStudent = (id, data) => api.put(`/admin/students/${id}`, data);
export const activateStudent = (id) => api.post(`/admin/students/${id}/activate`);
export const deactivateStudent = (id) =>
  api.post(`/admin/students/${id}/deactivate`);
export const resetStudentPassword = (id) =>
  api.post(`/admin/students/${id}/reset-password`);

// Admin: events and gallery
export const createEvent = (data) => api.post("/admin/events", data);
export const updateEvent = (id, data) => api.put(`/admin/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/admin/events/${id}`);
export const createGalleryItem = (data) => api.post("/admin/gallery", data);
export const updateGalleryItem = (id, data) =>
  api.put(`/admin/gallery/${id}`, data);
export const deleteGalleryItem = (id) => api.delete(`/admin/gallery/${id}`);

export default api;