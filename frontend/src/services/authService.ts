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

        // Store JWT and user in auth store
        useAuthStore.getState().login(userData, token);

        // Update API client with new token
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return { user: userData, token };
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
      useAuthStore.getState().updateProfile(response.data.data);
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
};

export default authService;
