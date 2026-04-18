export interface User {
  _id?: string;
  uid: string;
  email: string;
  phone: string;
  name: string;
  avatar?: string;
  phone_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  _id?: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  discount_percentage: number;
  stock: number;
  image_url: string;
  rating: number;
  reviews: Review[];
  nutritional_info?: Record<string, any>;
  veg_nonveg: "veg" | "non-veg";
  weight: string;
  created_at: Date;
  updated_at: Date;
}

export interface Review {
  user_id: string;
  rating: number;
  text: string;
  created_at: Date;
}

export interface Category {
  _id?: string;
  name: string;
  icon_url: string;
  parent_category?: string;
  display_order: number;
}

export interface Address {
  _id?: string;
  user_id: string;
  label: "home" | "office" | "other";
  street: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  is_default: boolean;
  saved_at: Date;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  price_at_purchase: number;
}

export interface Order {
  _id?: string;
  user_id: string;
  order_number: string;
  items: OrderItem[];
  total_amount: number;
  discount: number;
  delivery_fee: number;
  platform_fee: number;
  tax: number;
  status: "pending" | "payment_pending" | "confirmed" | "packed" | "picked_up" | "on_way" | "delivered" | "cancelled";
  payment_method: string;
  payment_id?: string;
  razorpay_order_id?: string;
  delivery_address: Address;
  scheduled_time?: Date;
  rider_id?: string;
  estimated_delivery_time?: Date;
  created_at: Date;
  updated_at: Date;
  delivered_at?: Date;
}

export interface Promo {
  _id?: string;
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_uses: number;
  used_count: number;
  applicable_categories?: string[];
  min_cart_value: number;
  valid_from: Date;
  valid_until: Date;
  is_active: boolean;
}

export interface Rider {
  _id?: string;
  name: string;
  phone: string;
  vehicle_type: string;
  rating: number;
  current_location: { lat: number; lng: number };
  is_available: boolean;
  daily_earnings: number;
}
