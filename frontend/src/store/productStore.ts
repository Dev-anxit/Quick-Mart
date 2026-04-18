import { create } from 'zustand';
import type { Product, Category } from '../types/domain';
import type { ProductFilters } from '../types/api';

interface ProductState {
  // Product Data
  products: Product[];
  categories: Category[];
  selectedProduct: Product | null;
  trendingProducts: Product[];
  flashDeals: Product[];

  // Filters & Sorting
  filters: ProductFilters;
  loading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  totalPages: number;
  hasMore: boolean;

  // Actions
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
  setSelectedProduct: (product: Product | null) => void;
  setTrendingProducts: (products: Product[]) => void;
  setFlashDeals: (products: Product[]) => void;
  setFilters: (filters: ProductFilters) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (currentPage: number, totalPages: number) => void;
  appendProducts: (products: Product[]) => void;
  resetFilters: () => void;
}

const initialFilters: ProductFilters = {
  page: 1,
  limit: 20,
  sort: 'newest',
};

export const useProductStore = create<ProductState>((set) => ({
  // Initial state
  products: [],
  categories: [],
  selectedProduct: null,
  trendingProducts: [],
  flashDeals: [],
  filters: initialFilters,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  hasMore: true,

  // Actions
  setProducts: (products: Product[]) => {
    set({ products });
  },

  setCategories: (categories: Category[]) => {
    set({ categories });
  },

  setSelectedProduct: (product: Product | null) => {
    set({ selectedProduct: product });
  },

  setTrendingProducts: (products: Product[]) => {
    set({ trendingProducts: products });
  },

  setFlashDeals: (products: Product[]) => {
    set({ flashDeals: products });
  },

  setFilters: (filters: ProductFilters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
        page: 1, // Reset to first page when filters change
      },
    }));
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setPagination: (currentPage: number, totalPages: number) => {
    set({
      currentPage,
      totalPages,
      hasMore: currentPage < totalPages,
    });
  },

  appendProducts: (products: Product[]) => {
    set((state) => ({
      products: [...state.products, ...products],
    }));
  },

  resetFilters: () => {
    set({
      filters: initialFilters,
      currentPage: 1,
      totalPages: 1,
      hasMore: true,
    });
  },
}));
