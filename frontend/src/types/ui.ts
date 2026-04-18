// Component Prop Interfaces

import type { ReactNode } from 'react';
import type { Product, Category, CartItem, Order, Toast, Address } from './domain';

// Basic UI Components
export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
}

export interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

export interface SkeletonProps {
  count?: number;
  height?: string;
  className?: string;
}

// Product Components
export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onQuickView?: (product: Product) => void;
}

export interface ProductImageProps {
  src: string;
  alt: string;
  onZoom?: () => void;
}

export interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onAddToCart: (product: Product, quantity: number) => void;
}

export interface ProductPriceProps {
  price: number;
  discount?: number;
}

export interface ProductRatingProps {
  rating: number;
  count?: number;
}

// Cart Components
export interface CartItemProps {
  item: CartItem;
  product?: Product;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export interface CartSummaryProps {
  totalPrice: number;
  deliveryFee: number;
  platformFee: number;
  tax: number;
  discount: number;
  grandTotal: number;
}

export interface PromoCodeInputProps {
  onApply: (code: string) => void;
  loading?: boolean;
  error?: string;
}

// Checkout Components
export interface AddressFormProps {
  address?: Address;
  onSubmit: (address: Address) => void;
  loading?: boolean;
}

export interface SavedAddressesProps {
  addresses: Address[];
  selectedId?: string;
  onSelect: (address: Address) => void;
  onEdit?: (address: Address) => void;
}

export interface PaymentMethodSelectProps {
  selected?: string;
  onSelect: (method: string) => void;
}

export interface OrderReviewProps {
  order: Order;
  items: CartItem[];
  onConfirm: () => void;
  loading?: boolean;
}

// Search Components
export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: Product[];
  onSelectSuggestion?: (product: Product) => void;
}

export interface SearchSuggestionsProps {
  suggestions: Product[];
  loading?: boolean;
  onSelect: (product: Product) => void;
}

// Filter Components
export interface CategoryFilterProps {
  categories: Category[];
  selected?: string;
  onSelect: (category: string) => void;
}

export interface PriceFilterProps {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}

export interface SortDropdownProps {
  selected: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}

// Order Tracking Components
export interface OrderCardProps {
  order: Order;
}

export interface OrderTimelineProps {
  status: Order['status'];
  estimatedDelivery?: string;
}

export interface RiderCardProps {
  name: string;
  rating: number;
  phone: string;
  onCall?: () => void;
}

export interface DeliveryTimerProps {
  estimatedTime: string;
}

// Page Props
export interface PageProps {
  children?: ReactNode;
}

// Layout Props
export interface LayoutProps {
  children: ReactNode;
}

export interface HeaderProps {
  cartCount?: number;
  onCartOpen?: () => void;
  onMenuOpen?: () => void;
}

export interface BottomNavProps {
  active?: string;
}

// Admin Components
export interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: number;
}

export interface OrderTableProps {
  orders: Order[];
  loading?: boolean;
  onStatusChange?: (orderId: string, status: string) => void;
}

export interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSubmit: (data: Partial<Product>) => void;
  loading?: boolean;
}
