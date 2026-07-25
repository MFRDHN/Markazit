import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 15000, // 15s — don't hang forever
  headers: {
    'Accept': 'application/json',
  }
});

// Request interceptor to add auth token (admin or user)
api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('admin_token');
    const userToken = localStorage.getItem('user_token');
    const token = adminToken || userToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // ponytail: only clear the token type that was in use — admin & user sessions coexist
      const wasAdmin = !!localStorage.getItem('admin_token');
      if (wasAdmin) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      } else {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_data');
      }
      const path = window.location.pathname;
      if (path.startsWith('/admin')) window.location.href = '/admin/login';
      else if (path.startsWith('/dashboard')) window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
