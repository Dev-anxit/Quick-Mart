import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import authService from '../services/authService';

interface UseAuthReturn {
  user: any | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithPhone: (phoneNumber: string) => Promise<any>;
  verifyOTP: (code: string, phoneNumber: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const authStore = useAuthStore();
  const { addToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Initialize auth state from localStorage
   */
  useEffect(() => {
    const token = authService.getToken();
    const user = authService.getCurrentUser();
    if (token && user) {
      // Auth state already loaded from localStorage via authStore
      console.log('Auth state restored from localStorage');
    }
  }, []);

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      addToast({
        type: 'info',
        message: 'Google login coming soon. Please use phone OTP for now.',
      });
      throw new Error('Google login is not configured. Please use phone authentication.');
    } catch (error: any) {
      console.error('Google login error:', error);
      addToast({
        type: 'error',
        message: error.message || 'Google login is not available',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPhone = async (phoneNumber: string) => {
    try {
      setIsLoading(true);
      
      // Validate phone number
      const cleanPhone = phoneNumber.replace(/[^\d]/g, '').slice(-10);
      if (cleanPhone.length !== 10) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // Send OTP through backend
      await authService.sendOTP(phoneNumber);
      
      addToast({
        type: 'success',
        message: 'OTP sent to your phone',
      });
      
      // Return phone number to be used in OTP verification
      return { phoneNumber: cleanPhone };
    } catch (error: any) {
      console.error('Phone login error:', error);
      addToast({
        type: 'error',
        message: error.message || 'Failed to send OTP',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (code: string, confirmationResult: any) => {
    try {
      setIsLoading(true);
      
      // Validate OTP
      if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
        throw new Error('Please enter a valid 6-digit OTP');
      }

      // Get phone number from confirmationResult
      const phoneNumber = confirmationResult?.phoneNumber;
      if (!phoneNumber) {
        throw new Error('Phone number not found. Please start over.');
      }

      // Verify OTP through backend
      await authService.verifyOTP(phoneNumber, code);

      addToast({
        type: 'success',
        message: 'Phone verified successfully!',
      });
    } catch (error: any) {
      console.error('OTP verification error:', error);
      addToast({
        type: 'error',
        message: error.message || 'Failed to verify OTP',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      addToast({
        type: 'success',
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      addToast({
        type: 'error',
        message: error.message || 'Failed to logout',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user: authStore.user,
    isLoggedIn: authStore.isLoggedIn,
    isLoading,
    loginWithGoogle,
    loginWithPhone,
    verifyOTP,
    logout,
  };
}
