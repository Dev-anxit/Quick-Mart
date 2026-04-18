import apiClient from './api';
import type { AddressResponse } from '../types/api';
import type { Address } from '../types/domain';

export const userService = {
  // Get all saved addresses
  getSavedAddresses: async () => {
    const response = await apiClient.get<{ success: boolean; data: AddressResponse[] }>(
      '/user/addresses'
    );
    return response.data.data;
  },

  // Add new address
  addAddress: async (address: Omit<Address, '_id' | 'user_id' | 'saved_at'>) => {
    const response = await apiClient.post<{ success: boolean; data: AddressResponse }>(
      '/user/addresses',
      address
    );
    return response.data.data;
  },

  // Update existing address
  updateAddress: async (id: string, address: Partial<Address>) => {
    const response = await apiClient.put<{ success: boolean; data: AddressResponse }>(
      `/user/addresses/${id}`,
      address
    );
    return response.data.data;
  },

  // Delete address
  deleteAddress: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean }>(
      `/user/addresses/${id}`
    );
    return response.data.success;
  },

  // Set address as default
  setDefaultAddress: async (id: string) => {
    const response = await apiClient.put<{ success: boolean; data: AddressResponse }>(
      `/user/addresses/${id}`,
      { is_default: true }
    );
    return response.data.data;
  },
};

export default userService;
