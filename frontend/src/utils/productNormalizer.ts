import type { ProductResponse, CategoryResponse } from '../types/api';

/**
 * Normalize product fields to ensure _id and id fields exist
 */
export function normalizeProduct(product: any): ProductResponse {
  return {
    ...product,
    _id: product._id || product.id,
    id: product.id || product._id,
    image_url: product.image_url || (product.image_urls?.length ? product.image_urls[0] : undefined),
    discount_percentage: product.discount_percentage || 0,
    rating: product.rating || 0,
  };
}

/**
 * Normalize multiple products
 */
export function normalizeProducts(products: any[]): ProductResponse[] {
  return products.map(normalizeProduct);
}

/**
 * Normalize category fields to ensure _id and id fields exist
 */
export function normalizeCategory(category: any): CategoryResponse {
  return {
    ...category,
    _id: category._id || category.id,
    id: category.id || category._id,
    icon_url: category.icon_url || '🛒',
  };
}

/**
 * Normalize multiple categories
 */
export function normalizeCategories(categories: any[]): CategoryResponse[] {
  return categories.map(normalizeCategory);
}
