import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Promo } from '../types/domain';

interface CartState {
  items: CartItem[];
  appliedPromo: Promo | null;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyPromo: (promo: Promo) => void;
  removePromo: () => void;
  clear: () => void;

  // Computed values
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getDiscount: () => number;
  getGrandTotal: (deliveryFee: number, platformFee: number, tax: number) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedPromo: null,

      addItem: (item: CartItem) => {
        set((state) => {
          const existing = state.items.find((i) => i.product_id === item.product_id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === item.product_id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => ({
          items: state.items
            .map((i) =>
              i.product_id === productId ? { ...i, quantity } : i
            )
            .filter((i) => i.quantity > 0),
        }));
      },

      applyPromo: (promo: Promo) => {
        set({ appliedPromo: promo });
      },

      removePromo: () => {
        set({ appliedPromo: null });
      },

      clear: () => {
        set({ items: [], appliedPromo: null });
      },

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => {
          return total + (item.price_at_purchase || 0) * item.quantity;
        }, 0);
      },

      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },

      getDiscount: () => {
        const state = get();
        if (!state.appliedPromo) return 0;
        const totalPrice = state.getTotalPrice();
        if (state.appliedPromo.discount_type === 'percentage') {
          return Math.round((totalPrice * state.appliedPromo.discount_value) / 100);
        }
        return state.appliedPromo.discount_value;
      },

      getGrandTotal: (deliveryFee: number, platformFee: number, tax: number) => {
        const state = get();
        const totalPrice = state.getTotalPrice();
        const discount = state.getDiscount();
        return totalPrice - discount + deliveryFee + platformFee + tax;
      },
    }),
    {
      name: 'cart-store',
      version: 1,
    }
  )
);
