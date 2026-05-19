import apiClient from './api';
import type {
  CreateOrderRequest,
  RazorpayOrderRequest,
  RazorpayOrderResponse,
  OrderResponse,
  PaginatedResponse,
} from '../types/api';

export const orderService = {
  // Create new order
  createOrder: async (data: CreateOrderRequest) => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: {
        order_id: string;
        order_number: string;
        amount: number;
        items: any[];
        delivery_fee: number;
        platform_fee: number;
        tax: number;
      };
    }>('/orders/create', data);
    return response.data.data;
  },

  // Create Razorpay order
  razorpayCreateOrder: async (data: RazorpayOrderRequest) => {
    const response = await apiClient.post<RazorpayOrderResponse>(
      '/orders/razorpay/create-order',
      data
    );
    return response.data.data;
  },

  // Get order by ID
  getOrderById: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: OrderResponse }>(
      `/orders/${id}`
    );
    return response.data.data;
  },

  // Get user orders (user ID is derived from JWT on backend)
  getUserOrders: async (page: number = 1, limit: number = 10) => {
    const { useAuthStore } = await import('../store/authStore');
    const userId = useAuthStore.getState().user?.uid || 'me';
    const response = await apiClient.get<PaginatedResponse<OrderResponse>>(
      `/orders/user/${userId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Verify payment (called after Razorpay payment)
  verifyPayment: async (paymentDetails: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    const response = await apiClient.post<{ success: boolean; data: OrderResponse }>(
      '/orders/razorpay/webhook',
      paymentDetails
    );
    return response.data.data;
  },
};

export default orderService;
