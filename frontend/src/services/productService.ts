import apiClient from './api';
import type { ProductFilters, PaginatedResponse, ProductResponse, CategoryResponse } from '../types/api';

export const productService = {
  // Get products with filters
  getProducts: async (filters: ProductFilters) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.price_min) params.append('price_min', filters.price_min.toString());
    if (filters.price_max) params.append('price_max', filters.price_max.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.sort) params.append('sort', filters.sort);
    params.append('page', (filters.page || 1).toString());
    params.append('limit', (filters.limit || 20).toString());

    const response = await apiClient.get<PaginatedResponse<ProductResponse>>(
      `/products?${params.toString()}`
    );
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: ProductResponse }>(
      `/products/${id}`
    );
    return response.data.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await apiClient.get<{ success: boolean; data: CategoryResponse[] }>(
      '/products/categories'
    );
    return response.data.data;
  },

  // Search products
  searchProducts: async (query: string, limit: number = 10) => {
    const response = await apiClient.get<{
      success: boolean;
      data: ProductResponse[];
      count: number;
    }>(`/products/search/${query}?limit=${limit}`);
    return response.data.data;
  },

  // Get trending products (TODO: add to backend)
  getTrendingProducts: async (limit: number = 10) => {
    // For now, fetch products with limit
    const response = await apiClient.get<PaginatedResponse<ProductResponse>>(
      `/products?limit=${limit}&sort=-rating`
    );
    return response.data.data;
  },

  // Get flash deals (TODO: add to backend)
  getFlashDeals: async (limit: number = 10) => {
    // For now, return products with discount
    const response = await apiClient.get<PaginatedResponse<ProductResponse>>(
      `/products?limit=${limit}&sort=-discount`
    );
    return response.data.data;
  },
};

export default productService;
