import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

// Production backend URL — Render deployment
const PRODUCTION_API = 'https://quick-mart-q63b.onrender.com/api';

// Vercel dashboard holds a stale URL. Override it in production.
const isProd = import.meta.env.PROD;
const API_URL = isProd ? PRODUCTION_API : (import.meta.env.VITE_API_BASE_URL || PRODUCTION_API);

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      useUIStore.getState().addToast({
        type: 'error',
        message: 'Session expired. Please login again.',
      });
      window.location.href = '/';
      return;
    }

    // Handle other errors
    if (error.response?.status === 500) {
      useUIStore.getState().addToast({
        type: 'error',
        message: 'Server error. Please try again later.',
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
