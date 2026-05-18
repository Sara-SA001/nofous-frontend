// frontend/lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// إضافة التوكن تلقائياً
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

// Handle unauthorized responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        // clear token storage and cookie
        try {
          sessionStorage.removeItem('token');
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        } catch (e) {}

        if (typeof window !== 'undefined') {
          const isAdminPath = window.location.pathname.startsWith('/admin');
          window.location.href = isAdminPath ? '/admin/login' : '/login';
        }
      }
    } catch (e) {
      // ignore
    }

    return Promise.reject(error);
  },
);

export default api;
