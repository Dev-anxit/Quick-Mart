// Business Entity Types

export interface Category {
  _id: string;
  name: string;
  icon_url: string;
  parent_category?: string;
  display_order: number;
}

export interface Review {
  rating: number;
  comment: string;
  author: string;
  createdAt: Date;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: Category;
  brand: string;
  price: number;
  discount_percentage: number;
  stock: number;
  image_url: string;
  rating: number;
  reviews: Review[];
  nutritional_info: string;
  veg_nonveg: 'veg' | 'nonveg';
  weight: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  uid: string;
  email: string;
  phone: string;
  name: string;
  avatar?: string;
  phone_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  _id: string;
  user_id: string;
  label: 'home' | 'office' | 'other';
  street: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  is_default: boolean;
  saved_at: Date;
}

export interface CartItem {
  product_id: string;
  product?: Product;
  quantity: number;
  price_at_purchase?: number;
  // Denormalized fields for cart drawer / checkout display
  name: string;
  price: number;
  image_url?: string;
}

export interface Cart {
  items: CartItem[];
  appliedPromo?: Promo;
  totalPrice: number;
  discount: number;
  deliveryFee: number;
  platformFee: number;
  tax: number;
  grandTotal: number;
}

export interface Order {
  _id: string;
  user_id: string;
  order_number: string;
  items: CartItem[];
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
  created_at: Date;
  updated_at: Date;
  delivered_at?: Date;
}

export interface Promo {
  _id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses: number;
  used_count: number;
  applicable_categories: string[];
  min_cart_value: number;
  valid_from: Date;
  valid_until: Date;
  is_active: boolean;
}

export interface Rider {
  _id: string;
  name: string;
  phone: string;
  vehicle_type: string;
  rating: number;
  current_location: {
    lat: number;
    lng: number;
  };
  is_available: boolean;
  daily_earnings: number;
}

// UI State Types
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface OrderStatus {
  status: Order['status'];
  label: string;
  color: string;
  step: number;
  completed: boolean;
}
