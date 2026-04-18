// Validation Utilities

export const validators = {
  // Email validation
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone validation (Indian format)
  validatePhone: (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleaned = phone.replace(/\D/g, '');
    return phoneRegex.test(cleaned) && cleaned.length === 10;
  },

  // Pincode validation (Indian format)
  validatePincode: (pincode: string): boolean => {
    const pincodeRegex = /^\d{6}$/;
    const cleaned = pincode.replace(/\D/g, '');
    return pincodeRegex.test(cleaned);
  },

  // Password validation
  validatePassword: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*)');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  // Name validation
  validateName: (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 100;
  },

  // Address validation
  validateAddress: (address: {
    street?: string;
    city?: string;
    pincode?: string;
  }): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!address.street || address.street.trim().length < 5) {
      errors.push('Street address must be at least 5 characters');
    }
    if (!address.city || address.city.trim().length < 2) {
      errors.push('City name must be at least 2 characters');
    }
    if (!address.pincode || !validators.validatePincode(address.pincode)) {
      errors.push('Invalid pincode');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  // Cart item validation
  validateCartItem: (quantity: number): boolean => {
    return Number.isInteger(quantity) && quantity > 0 && quantity <= 999;
  },

  // Price validation
  validatePrice: (price: number): boolean => {
    return typeof price === 'number' && price > 0;
  },

  // Promo code validation
  validatePromoCode: (code: string): boolean => {
    return code.trim().length >= 3 && code.trim().length <= 20;
  },

  // Credit card validation (basic Luhn check)
  validateCreditCard: (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\D/g, '');
    if (cleaned.length !== 16) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  },

  // CVV validation
  validateCVV: (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv);
  },

  // Search query validation
  validateSearchQuery: (query: string): boolean => {
    return query.trim().length >= 2 && query.trim().length <= 100;
  },
};

export default validators;
