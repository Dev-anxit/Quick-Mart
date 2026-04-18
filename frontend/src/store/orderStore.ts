import { create } from 'zustand';
import type { Order } from '../types/domain';

interface RiderLocation {
  lat: number;
  lng: number;
}

interface OrderState {
  // Current Order
  currentOrder: Order | null;
  orderHistory: Order[];

  // Tracking
  trackingStatus: Order['status'] | null;
  riderLocation: RiderLocation | null;
  estimatedDelivery: string | null;

  // UI State
  loading: boolean;
  error: string | null;

  // Actions
  setCurrentOrder: (order: Order | null) => void;
  setOrderHistory: (orders: Order[]) => void;
  addToHistory: (order: Order) => void;
  setTrackingStatus: (status: Order['status']) => void;
  setRiderLocation: (location: RiderLocation) => void;
  setEstimatedDelivery: (time: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  // Initial state
  currentOrder: null,
  orderHistory: [],
  trackingStatus: null,
  riderLocation: null,
  estimatedDelivery: null,
  loading: false,
  error: null,

  // Actions
  setCurrentOrder: (order: Order | null) => {
    set({
      currentOrder: order,
      trackingStatus: order?.status || null,
      estimatedDelivery: order?.estimated_delivery_time || null,
    });
  },

  setOrderHistory: (orders: Order[]) => {
    set({ orderHistory: orders });
  },

  addToHistory: (order: Order) => {
    set((state) => ({
      orderHistory: [order, ...state.orderHistory],
    }));
  },

  setTrackingStatus: (status: Order['status']) => {
    set({ trackingStatus: status });

    // Update current order status if exists
    const current = get().currentOrder;
    if (current) {
      set({
        currentOrder: {
          ...current,
          status,
          updated_at: new Date(),
        },
      });
    }
  },

  setRiderLocation: (location: RiderLocation) => {
    set({ riderLocation: location });
  },

  setEstimatedDelivery: (time: string | null) => {
    set({ estimatedDelivery: time });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearCurrentOrder: () => {
    set({
      currentOrder: null,
      trackingStatus: null,
      riderLocation: null,
      estimatedDelivery: null,
    });
  },
}));
