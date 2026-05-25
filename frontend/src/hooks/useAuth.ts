import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import authService from '../services/authService';

import type { User } from '../types/domain';

interface UseAuthReturn {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithPhone: (phoneNumber: string) => Promise<{ phoneNumber: string }>;
  verifyOTP: (code: string, confirmationResult: any) => Promise<void>;
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

      const isDemoFirebase = 
        !import.meta.env.VITE_FIREBASE_API_KEY ||
        import.meta.env.VITE_FIREBASE_API_KEY.includes('Demo') ||
        import.meta.env.VITE_FIREBASE_API_KEY.includes('REPLACE');

      let authResult;

      if (isDemoFirebase) {
        // Dev Mode Mock Google Login
        console.warn('⚠️ Demo Firebase configuration detected. Simulating Google Login.');
        
        // Let's create a mock login result
        const mockEmail = "test_google_user@gmail.com";
        const mockName = "Google Test User";
        authResult = {
          user: {
            uid: "google_test_user",
            email: mockEmail,
            name: mockName,
            phone: "",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150",
          },
          token: "mock-google-token-test_google_user",
        };
      } else {
        // Real Google Login
        const { signInWithGoogle: firebaseSignInWithGoogle } = await import('../services/firebase');
        authResult = await firebaseSignInWithGoogle();
      }

      // Verify the token with backend to establish JWT session
      await authService.verifyFirebaseToken(authResult.token);

      addToast({
        type: 'success',
        message: 'Logged in successfully with Google!',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google login failed';
      console.error('Google login error:', error);
      addToast({
        type: 'error',
        message,
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
      const res = await authService.sendOTP(phoneNumber);

      const otp = (res as any)?.otp;
      addToast({
        type: 'success',
        message: otp ? `OTP (Dev Mode): ${otp}` : 'OTP sent to your phone',
      });

      // Return phone number to be used in OTP verification
      return { phoneNumber: cleanPhone };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send OTP';
      console.error('Phone login error:', error);
      addToast({
        type: 'error',
        message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (code: string, confirmationResult: { phoneNumber: string }) => {
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
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to verify OTP';
      console.error('OTP verification error:', error);
      addToast({
        type: 'error',
        message,
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
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to logout';
      console.error('Logout error:', error);
      addToast({
        type: 'error',
        message,
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
