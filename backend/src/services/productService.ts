import { prisma } from '../config/prisma';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount_percentage: number;
  stock: number;
  rating: number;
  image_urls: string[];
  category_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class ProductService {
  static async getProducts(filters: {
    category?: string;
    page?: number;
    limit?: number;
    sort?: string;
  } = {}): Promise<{ products: Product[]; total: number }> {
    const {
      category,
      page = 1,
      limit = 20,
      sort = 'newest',
    } = filters;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { is_active: true };
    if (category) {
      where.category_id = category;
    }

    // Build order by
    const orderBy: any = {};
    switch (sort) {
      case 'price_asc':
        orderBy.price = 'asc';
        break;
      case 'price_desc':
        orderBy.price = 'desc';
        break;
      case 'rating':
      case '-rating':
        orderBy.rating = 'desc';
        break;
      case 'discount':
      case '-discount':
        orderBy.discount_percentage = 'desc';
        break;
      case 'newest':
      default:
        orderBy.created_at = 'desc';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return { products: products as Product[], total };
  }

  static async getProductById(productId: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id: productId },
    }) as Promise<Product | null>;
  }

  static async createProduct(data: Partial<Product>): Promise<Product> {
    return prisma.product.create({
      data: {
        name: data.name || '',
        description: data.description,
        price: data.price || 0,
        discount_percentage: data.discount_percentage || 0,
        stock: data.stock || 0,
        rating: data.rating || 0,
        image_urls: data.image_urls || [],
        category_id: data.category_id || '',
        is_active: data.is_active !== false,
      },
    }) as Promise<Product>;
  }

  static async updateProduct(productId: string, data: Partial<Product>): Promise<Product> {
    return prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        discount_percentage: data.discount_percentage,
        stock: data.stock,
        rating: data.rating,
        image_urls: data.image_urls,
        is_active: data.is_active,
      },
    }) as Promise<Product>;
  }

  static async deleteProduct(productId: string): Promise<void> {
    await prisma.product.delete({
      where: { id: productId },
    });
  }

  static async getCategories() {
    return prisma.category.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
    });
  }

  static async searchProducts(query: string, limit: number = 20): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        is_active: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
    }) as Promise<Product[]>;
  }
}
