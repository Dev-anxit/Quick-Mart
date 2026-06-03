// Constants & Configuration

export const THEME_COLORS = {
  primary: {
    50: '#f3e5f5',
    100: '#e1bee7',
    200: '#ce93d8',
    300: '#ba68c8',
    400: '#ab47bc',
    500: '#9c27b0',
    600: '#8e24aa',
    700: '#7b1fa2',
    800: '#6a0dad',
    900: '#4a148c',
    950: '#1a0533', // Dark violet base
  },
  accent: {
    green: '#00e676',
    amber: '#ffab00',
    red: '#ff1744',
    blue: '#2196f3',
  },
  neutral: {
    white: '#ffffff',
    black: '#000000',
    gray: '#f5f5f5',
    darkGray: '#424242',
  },
};

export const ORDER_STATUSES = {
  pending: {
    label: 'Pending',
    color: '#ffab00',
    step: 1,
  },
  payment_pending: {
    label: 'Payment Pending',
    color: '#ff9800',
    step: 1,
  },
  confirmed: {
    label: 'Confirmed',
    color: '#2196f3',
    step: 2,
  },
  packed: {
    label: 'Packed',
    color: '#9c27b0',
    step: 3,
  },
  picked_up: {
    label: 'Picked Up',
    color: '#673ab7',
    step: 4,
  },
  on_way: {
    label: 'On the Way',
    color: '#3f51b5',
    step: 5,
  },
  delivered: {
    label: 'Delivered',
    color: '#00e676',
    step: 6,
  },
  cancelled: {
    label: 'Cancelled',
    color: '#ff1744',
    step: 0,
  },
};

export const DELIVERY_FEES = {
  BASE_FEE: 50, // ₹50 base delivery fee
  FREE_ABOVE: 500, // Free delivery on orders above ₹500
};

export const PLATFORM_FEES = {
  PERCENTAGE: 0.05, // 5% platform fee
};

export const TAX_RATE = 0.05; // 5% GST

export const PAYMENT_METHODS = {
  UPI: 'upi',
  CARD: 'card',
  NETBANKING: 'netbanking',
  WALLET: 'wallet',
  COD: 'cod', // Cash on Delivery
};

export const VEG_NONVEG_OPTIONS = {
  VEG: { value: 'veg', label: 'Vegetarian', icon: '🟢' },
  NONVEG: { value: 'nonveg', label: 'Non-Vegetarian', icon: '🔴' },
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating: High to Low' },
  { value: 'discount', label: 'Discount: High to Low' },
];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const CACHE_DURATION = {
  PRODUCTS: 5 * 60 * 1000, // 5 minutes
  CATEGORIES: 10 * 60 * 1000, // 10 minutes
  USER_DATA: 1 * 60 * 1000, // 1 minute
};

export const DEBOUNCE_DELAYS = {
  SEARCH: 300, // milliseconds
  FILTER: 500,
};

export const DEFAULT_COORDINATES = {
  LAT: 19.0760, // Mumbai
  LNG: 72.8777,
};

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://quick-mart-q63b.onrender.com';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://quick-mart-q63b.onrender.com/api';

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  ORDER_CREATION_FAILED: 'Failed to create order. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  ORDER_CREATED: 'Order created successfully!',
  PAYMENT_SUCCESS: 'Payment successful!',
  ADDRESS_SAVED: 'Address saved successfully.',
  ADDRESS_DELETED: 'Address deleted successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  ITEM_ADDED: 'Item added to cart.',
  ITEM_REMOVED: 'Item removed from cart.',
  PROMO_APPLIED: 'Promo code applied successfully.',
};
