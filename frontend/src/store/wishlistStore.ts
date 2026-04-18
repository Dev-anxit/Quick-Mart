import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  product_id: string;
  name: string;
  price: number;
  image_url?: string;
  added_at: string;
}

interface WishlistState {
  items: WishlistItem[];

  // Actions
  addItem: (item: Omit<WishlistItem, 'added_at'>) => void;
  removeItem: (product_id: string) => void;
  isInWishlist: (product_id: string) => boolean;
  clearWishlist: () => void;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const state = get();
        if (!state.isInWishlist(item.product_id)) {
          set({
            items: [
              ...state.items,
              {
                ...item,
                added_at: new Date().toISOString(),
              },
            ],
          });
        }
      },

      removeItem: (product_id) => {
        set((state) => ({
          items: state.items.filter((item) => item.product_id !== product_id),
        }));
      },

      isInWishlist: (product_id) => {
        const state = get();
        return state.items.some((item) => item.product_id === product_id);
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'wishlist-store',
      version: 1,
    }
  )
);
