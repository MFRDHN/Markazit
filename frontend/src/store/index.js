import { create } from 'zustand';
import api from '../services/api';

// Auth Store for Admin
export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('admin_user') || 'null'),
  token: localStorage.getItem('admin_token') || null,
  isAuthenticated: !!localStorage.getItem('admin_token'),
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await api.post('/admin/login', { email, password });
      const { user, token } = response.data;
      // ponytail: don't clear user_token — admin & user sessions coexist in different tabs
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        message: error.response?.data?.message || 'Login gagal',
      };
    }
  },

  logout: async () => {
    try {
      await api.post('/admin/logout');
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    // ponytail: don't touch user_token/user_data — only clean up admin session
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    try {
      const response = await api.get('/admin/me');
      set({ user: response.data.user, isAuthenticated: true });
    } catch {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));

// Language Store
export const useLanguageStore = create((set) => ({
  language: localStorage.getItem('i18nextLng') || 'id',
  setLanguage: (lang) => {
    localStorage.setItem('i18nextLng', lang);
    set({ language: lang });
    // Set document direction for RTL
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  },
}));
