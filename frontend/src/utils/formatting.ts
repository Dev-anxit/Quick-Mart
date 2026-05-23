// Formatting Utilities

export const formatters = {
  // Format price as Indian currency (INR)
  formatPrice: (amount: number, includeCurrency: boolean = true): string => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

    return includeCurrency ? formatted : formatted.replace('₹', '').trim();
  },

  // Format date
  formatDate: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  },

  // Format date only (without time)
  formatDateOnly: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  },

  // Format time only
  formatTimeOnly: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  },

  // Format relative time (e.g., "2 hours ago")
  formatRelativeTime: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  },

  // Format countdown timer (MM:SS)
  formatCountdown: (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  },

  // Format order number
  formatOrderNumber: (number: string): string => {
    return number.replace('ORD-', '#');
  },

  // Format product rating
  formatRating: (rating: number): string => {
    return (Math.round(rating * 10) / 10).toFixed(1);
  },

  // Format discount percentage
  formatDiscount: (discount: number): string => {
    return `${discount}% off`;
  },

  // Format weight/size
  formatWeight: (weight: string): string => {
    return weight;
  },

  // Truncate text
  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  },

  // Format phone number
  formatPhone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  },

  // Format pincode
  formatPincode: (pincode: string): string => {
    return pincode.slice(0, 6);
  },
};

export default formatters;
