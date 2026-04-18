import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import authService from '../services/authService';
import * as firebaseAuth from '../services/firebase';

interface UseAuthReturn {
  user: any | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithPhone: (phoneNumber: string) => Promise<any>;
  verifyOTP: (code: string, confirmationResult: any) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const authStore = useAuthStore();
  const { addToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Initialize Firebase auth state listener
   */
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          setIsLoading(true);
          const firebaseToken = await firebaseUser.getIdToken();
          // Verify Firebase token with backend and get JWT
          await authService.verifyFirebaseToken(firebaseToken);
        } catch (error) {
          console.error('Auth initialization error:', error);
          addToast({
            type: 'error',
            message: 'Failed to initialize authentication',
          });
          await authService.logout();
        } finally {
          setIsLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const { token } = await firebaseAuth.signInWithGoogle();

      // Token will be verified through onAuthChange
      addToast({
        type: 'success',
        message: 'Logged in successfully!',
      });
    } catch (error: any) {
      console.error('Google login error:', error);
      addToast({
        type: 'error',
        message: error.message || 'Failed to login with Google',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPhone = async (phoneNumber: string) => {
    try {
      setIsLoading(true);
      const confirmationResult = await firebaseAuth.initPhoneAuth(phoneNumber);
      addToast({
        type: 'success',
        message: 'OTP sent to your phone',
      });
      return confirmationResult;
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
      const { token } = await firebaseAuth.verifyPhoneOTP(code, confirmationResult);

      // Token will be verified through onAuthChange
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
      await firebaseAuth.signOut();
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
