import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/domain';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isTokenValid: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      setUser: (user: User) => {
        set({
          user,
          isLoggedIn: true,
        });
      },

      setToken: (token: string) => {
        set({ token });
      },

      login: (user: User, token: string) => {
        set({
          user,
          token,
          isLoggedIn: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isLoggedIn: false,
        });
      },

      updateProfile: (updates: Partial<User>) => {
        const state = get();
        if (state.user) {
          set({
            user: {
              ...state.user,
              ...updates,
            },
          });
        }
      },

      isTokenValid: () => {
        const state = get();
        return !!state.token && state.isLoggedIn;
      },
    }),
    {
      name: 'auth-store',
      version: 1,
    }
  )
);
