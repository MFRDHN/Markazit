import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 15000, // 15s — don't hang forever
  headers: {
    'Accept': 'application/json',
  }
});

// Request interceptor to add auth token (admin or user)
// Token dipilih per-request berdasarkan halaman aktif, bukan admin-first,
// supaya sesi user & admin yang coexist tidak saling menimpa.
const pickToken = () => {
  const isAdminPage = window.location.pathname.startsWith('/admin');
  const token = isAdminPage
    ? localStorage.getItem('admin_token')
    : localStorage.getItem('user_token') || localStorage.getItem('admin_token');
  return { token, isAdminPage };
};

api.interceptors.request.use(
  (config) => {
    const { token, isAdminPage } = pickToken();
    config._isAdminToken = isAdminPage && localStorage.getItem('admin_token') === token;
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
      const wasAdmin = error.config?._isAdminToken ?? window.location.pathname.startsWith('/admin');
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
