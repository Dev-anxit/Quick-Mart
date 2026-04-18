/**
 * Promo Code Validation Service
 */

export interface PromoCode {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses: number;
  used_count: number;
  applicable_categories?: string[];
  min_cart_value: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

/**
 * Validate promo code locally
 */
export function validatePromoCode(
  code: PromoCode,
  cartTotal: number,
  appliedCategory?: string
): { valid: boolean; error?: string; discount?: number } {
  // Check if code is active
  if (!code.is_active) {
    return { valid: false, error: 'This promo code is no longer active' };
  }

  // Check usage limit
  if (code.used_count >= code.max_uses) {
    return { valid: false, error: 'This promo code has reached its usage limit' };
  }

  // Check date validity
  const now = new Date();
  const validFrom = new Date(code.valid_from);
  const validUntil = new Date(code.valid_until);

  if (now < validFrom) {
    return { valid: false, error: 'This promo code is not yet valid' };
  }

  if (now > validUntil) {
    return { valid: false, error: 'This promo code has expired' };
  }

  // Check minimum cart value
  if (cartTotal < code.min_cart_value) {
    return {
      valid: false,
      error: `Minimum cart value of ₹${code.min_cart_value} required`,
    };
  }

  // Check applicable categories
  if (code.applicable_categories && appliedCategory) {
    if (!code.applicable_categories.includes(appliedCategory)) {
      return { valid: false, error: 'This code is not applicable to this category' };
    }
  }

  // Calculate discount
  let discount = 0;
  if (code.discount_type === 'percentage') {
    discount = (cartTotal * code.discount_value) / 100;
  } else {
    discount = code.discount_value;
  }

  return { valid: true, discount };
}

/**
 * Format promo code for display
 */
export function formatPromoCode(code: PromoCode): string {
  if (code.discount_type === 'percentage') {
    return `${code.discount_value}% OFF - Min ₹${code.min_cart_value}`;
  } else {
    return `₹${code.discount_value} OFF - Min ₹${code.min_cart_value}`;
  }
}
