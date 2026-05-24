import apiClient from './api';

export const orderService = {
  // Create new order
  createOrder: async (data: {
    items: Array<{ product_id: string; quantity: number; price_at_purchase: number }>;
    delivery_address: string;
    delivery_time?: string;
    promo_code?: string;
    payment_method: string;
  }) => {
    const response = await apiClient.post<{
      success: boolean;
      message?: string;
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

  // Create Razorpay payment order
  razorpayCreateOrder: async (data: { order_id: string; amount: number }) => {
    const response = await apiClient.post<{
      success: boolean;
      data: {
        razorpay_order_id: string;
        amount: number;
        currency: string;
        receipt: string;
        key?: string;
      };
    }>('/orders/razorpay/create-order', data);
    return response.data.data;
  },

  // Get order by ID
  getOrderById: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: any }>(`/orders/${id}`);
    return response.data.data;
  },

  // Get user orders (user ID is derived from JWT on backend)
  getUserOrders: async (page: number = 1, limit: number = 10) => {
    const response = await apiClient.get<{
      success: boolean;
      data: any[];
      pagination: { page: number; total: number; pages: number };
    }>(`/orders?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Verify payment (called after Razorpay payment)
  verifyPayment: async (paymentDetails: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId?: string;
  }) => {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      '/orders/razorpay/webhook',
      paymentDetails
    );
    return response.data;
  },
};

export default orderService;
