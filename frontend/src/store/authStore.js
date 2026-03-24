import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://aria-backend-7040.onrender.com/api' : 'http://localhost:5000/api');

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('userInfo')) || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      set({ user: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response && error.response.data.message ? error.response.data.message : error.message,
        isLoading: false 
      });
    }
  },

  register: async (name, email, password, phone) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/auth/register`, { name, email, password, phone });
      // User must log in manually after registration
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error.response && error.response.data.message ? error.response.data.message : error.message,
        isLoading: false 
      });
    }
  },

  logout: () => {
    localStorage.removeItem('userInfo');
    set({ user: null });
  },
}));
