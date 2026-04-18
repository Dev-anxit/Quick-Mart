import { create } from 'zustand';
import type { Toast } from '../types/domain';

interface UIState {
  // Modals & Drawers
  isCartDrawerOpen: boolean;
  isMobileMenuOpen: boolean;
  isFiltersDrawerOpen: boolean;

  // Notifications
  toasts: Toast[];

  // Loading States
  isLoading: boolean;
  loadingMessage: string;

  // Actions
  toggleCartDrawer: () => void;
  setCartDrawerOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleFiltersDrawer: () => void;
  setFiltersDrawerOpen: (open: boolean) => void;

  // Toast Actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Loading Actions
  setLoading: (loading: boolean, message?: string) => void;
  clearLoading: () => void;
}

let toastId = 0;

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  isCartDrawerOpen: false,
  isMobileMenuOpen: false,
  isFiltersDrawerOpen: false,
  toasts: [],
  isLoading: false,
  loadingMessage: '',

  // Drawer Actions
  toggleCartDrawer: () => {
    set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen }));
  },

  setCartDrawerOpen: (open: boolean) => {
    set({ isCartDrawerOpen: open });
  },

  toggleMobileMenu: () => {
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
  },

  setMobileMenuOpen: (open: boolean) => {
    set({ isMobileMenuOpen: open });
  },

  toggleFiltersDrawer: () => {
    set((state) => ({ isFiltersDrawerOpen: !state.isFiltersDrawerOpen }));
  },

  setFiltersDrawerOpen: (open: boolean) => {
    set({ isFiltersDrawerOpen: open });
  },

  // Toast Actions
  addToast: (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${toastId++}`;
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 3000,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-remove toast after duration
    if (newToast.duration) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  // Loading Actions
  setLoading: (loading: boolean, message?: string) => {
    set({
      isLoading: loading,
      loadingMessage: message || '',
    });
  },

  clearLoading: () => {
    set({
      isLoading: false,
      loadingMessage: '',
    });
  },
}));
