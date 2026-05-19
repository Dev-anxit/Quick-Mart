// API Request & Response Types

// Pagination
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

// Filters
export interface ProductFilters {
  category?: string;
  price_min?: number;
  price_max?: number;
  search?: string;
  brand?: string;
  rating?: number;
  veg_nonveg?: 'veg' | 'non-veg';
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'discount';
  page?: number;
  limit?: number;
}

// Product Responses
export interface ProductResponse {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  discount_percentage: number;
  stock: number;
  image_url: string;
  rating: number;
  reviews: any[];
  nutritional_info: string;
  veg_nonveg: 'veg' | 'non-veg';
  weight: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryResponse {
  _id: string;
  name: string;
  icon_url: string;
  parent_category?: string;
  display_order: number;
}

// Order Responses
export interface OrderItemResponse {
  product_id: string;
  quantity: number;
  price_at_purchase: number;
}

export interface OrderResponse {
  _id: string;
  user_id: string;
  order_number: string;
  items: OrderItemResponse[];
  total_amount: number;
  delivery_fee: number;
  platform_fee: number;
  tax: number;
  grand_total: number;
  status:
    | 'pending'
    | 'payment_pending'
    | 'confirmed'
    | 'packed'
    | 'picked_up'
    | 'on_way'
    | 'delivered'
    | 'cancelled';
  payment_method: string;
  payment_id?: string;
  razorpay_order_id?: string;
  delivery_address: string;
  scheduled_time?: string;
  rider_id?: string;
  estimated_delivery_time?: string;
  created_at: string;
  updated_at?: string;
  delivered_at?: string;
}

// Auth Responses
export interface UserResponse {
  uid: string;
  email: string;
  phone: string;
  name: string;
  avatar?: string;
  phone_verified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    uid: string;
    email: string;
    token: string;
  };
}

// Address
export interface AddressResponse {
  _id: string;
  user_id: string;
  label: 'home' | 'office' | 'other';
  street: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  is_default: boolean;
  saved_at: string;
}

// Promo
export interface PromoResponse {
  _id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses: number;
  used_count: number;
  applicable_categories: string[];
  min_cart_value: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

// Dashboard
export interface DashboardMetricsResponse {
  total_orders: number;
  total_revenue: number;
  orders_by_status: Array<{ _id: string; count: number }>;
  low_stock_products: ProductResponse[];
  top_products: ProductResponse[];
  revenue_trend: Array<{ _id: string; revenue: number; orders: number }>;
}

// Cart
export interface CartItem {
  product_id: string;
  quantity: number;
  price_at_purchase?: number;
}

// Checkout
export interface CreateOrderRequest {
  items: CartItem[];
  delivery_address: string;
  scheduled_time?: string;
  delivery_time?: string;
  promo_code?: string;
  payment_method: string;
}

export interface RazorpayOrderRequest {
  order_id: string;
  amount: number;
}

export interface RazorpayOrderResponse {
  success: boolean;
  data: {
    razorpay_order_id: string;
    amount: number;
    currency: string;
    receipt: string;
  };
}
