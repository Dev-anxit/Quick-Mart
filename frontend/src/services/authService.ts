import apiClient from './api';
import type { UserResponse, LoginResponse } from '../types/api';
import { useAuthStore } from '../store/authStore';

export const authService = {
  /**
   * Verify Firebase token with backend
   * Exchanges Firebase ID token for JWT token
   */
  verifyFirebaseToken: async (firebaseToken: string) => {
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: UserResponse & { token: string }
      }>('/auth/verify-token', { token: firebaseToken });

      if (response.data.success && response.data.data) {
        const { token, ...userData } = response.data.data;

        // Convert string dates to Date objects
        const user = {
          ...userData,
          createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
          updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date(),
        };

        // Store JWT and user in auth store
        useAuthStore.getState().login(user, token);

        // Update API client with new token
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return { user, token };
      }

      throw new Error('Token verification failed');
    } catch (error) {
      console.error('Firebase token verification error:', error);
      throw error;
    }
  },

  /**
   * Login with email and password (fallback method)
   */
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data.data;
  },

  /**
   * Logout from both Firebase and backend
   */
  logout: async () => {
    try {
      // Call backend logout
      await apiClient.post('/auth/logout').catch(() => {
        // Ignore errors on logout - proceed with local cleanup
      });

      // Clear local auth state
      useAuthStore.getState().logout();

      // Clear API client token
      delete apiClient.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if backend call fails
      useAuthStore.getState().logout();
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: {
    name?: string;
    phone?: string;
    avatar?: string;
  }) => {
    const response = await apiClient.put<{ success: boolean; data: UserResponse }>(
      '/auth/profile',
      data
    );

    if (response.data.success) {
      const user = {
        ...response.data.data,
        createdAt: response.data.data.createdAt ? new Date(response.data.data.createdAt) : new Date(),
        updatedAt: response.data.data.updatedAt ? new Date(response.data.data.updatedAt) : new Date(),
      };
      useAuthStore.getState().updateProfile(user);
    }

    return response.data.data;
  },

  /**
   * Get current token from store
   */
  getToken: () => {
    return useAuthStore.getState().token;
  },

  /**
   * Get current user from store
   */
  getCurrentUser: () => {
    return useAuthStore.getState().user;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return useAuthStore.getState().isLoggedIn;
  },

  /**
   * Send OTP to phone number
   */
  sendOTP: async (phone: string) => {
    try {
      // Format phone number - remove country code if present
      const cleanPhone = phone.replace(/[^\d]/g, '').slice(-10);
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        debug_otp?: string;
      }>('/auth/send-otp', { phone: cleanPhone });

      if (response.data.success) {
        return response.data;
      }

      throw new Error(response.data.message || 'Failed to send OTP');
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  },

  /**
   * Verify OTP and login
   */
  verifyOTP: async (phone: string, otp: string) => {
    try {
      // Format phone number - remove country code if present
      const cleanPhone = phone.replace(/[^\d]/g, '').slice(-10);
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: UserResponse & { token: string };
      }>('/auth/verify-otp', { phone: cleanPhone, otp });

      if (response.data.success && response.data.data) {
        const { token, ...userData } = response.data.data;

        // Convert string dates to Date objects
        const user = {
          ...userData,
          createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
          updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date(),
        };

        // Store JWT and user in auth store
        useAuthStore.getState().login(user, token);

        // Update API client with new token
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return { user, token };
      }

      throw new Error(response.data.message || 'OTP verification failed');
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  },
};

export default authService;
