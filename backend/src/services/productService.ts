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

export const FALLBACK_CATEGORIES = [
  { id: 'cat_vegetables', name: 'Vegetables', description: 'Fresh farm vegetables delivered daily', image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&q=80', is_active: true },
  { id: 'cat_fruits', name: 'Fruits', description: 'Juicy seasonal and exotic fruits', image_url: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=200&q=80', is_active: true },
  { id: 'cat_dairy', name: 'Dairy & Eggs', description: 'Fresh milk, cheese, yogurt and eggs', image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&q=80', is_active: true },
  { id: 'cat_bakery', name: 'Bakery', description: 'Freshly baked breads, cakes and pastries', image_url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=200&q=80', is_active: true },
  { id: 'cat_beverages', name: 'Beverages', description: 'Juices, soft drinks, water and energy drinks', image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&q=80', is_active: true },
  { id: 'cat_snacks', name: 'Snacks', description: 'Chips, cookies, nuts and healthy snacks', image_url: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=200&q=80', is_active: true },
  { id: 'cat_personal', name: 'Personal Care', description: 'Shampoo, soap, skincare and hygiene products', image_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=80', is_active: true },
  { id: 'cat_household', name: 'Household', description: 'Cleaning supplies and home essentials', image_url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&q=80', is_active: true },
];

export const FALLBACK_PRODUCTS = [
  // --- Vegetables ---
  {
    id: 'fb_veg_1',
    name: 'Fresh Tomato (Hybrid) (JioMart)',
    description: 'Fresh farm hybrid tomatoes. High in Vitamin C and Lycopene. Sourced from JioMart.',
    price: 32,
    discount_percentage: 5,
    stock: 120,
    rating: 4.3,
    category_id: 'cat_vegetables',
    image_urls: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_veg_2',
    name: 'Tomato (Local, Safe to Eat) (Swiggy Instamart)',
    description: 'Naturally grown tomatoes, sorted and packed under strict hygiene conditions. Sourced from Swiggy Instamart.',
    price: 36,
    discount_percentage: 0,
    stock: 90,
    rating: 4.5,
    category_id: 'cat_vegetables',
    image_urls: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_veg_3',
    name: 'Organic Tomato (Zepto)',
    description: '100% certified organic tomatoes. Earthy taste and pesticide-free. Sourced from Zepto.',
    price: 45,
    discount_percentage: 10,
    stock: 60,
    rating: 4.6,
    category_id: 'cat_vegetables',
    image_urls: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_veg_4',
    name: 'Fresh Tomato (Hydroponic) (Blinkit)',
    description: 'Premium hydroponic tomatoes, extra sweet and juicy. Delivered in 10 minutes. Sourced from Blinkit.',
    price: 48,
    discount_percentage: 15,
    stock: 50,
    rating: 4.7,
    category_id: 'cat_vegetables',
    image_urls: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_veg_5',
    name: 'New Potatoes (Aloo) (JioMart)',
    description: 'Freshly harvested new crop potatoes, directly from fields. Sourced from JioMart.',
    price: 28,
    discount_percentage: 0,
    stock: 300,
    rating: 4.1,
    category_id: 'cat_vegetables',
    image_urls: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_veg_6',
    name: 'Potato (Jyoti Premium) (Swiggy Instamart)',
    description: 'High-quality Jyoti variety potatoes, ideal for frying and boiling. Sourced from Swiggy Instamart.',
    price: 34,
    discount_percentage: 5,
    stock: 200,
    rating: 4.4,
    category_id: 'cat_vegetables',
    image_urls: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_veg_7',
    name: 'Potato (Zepto)',
    description: 'Fresh selection potatoes, sorted by hand. Sourced from Zepto.',
    price: 32,
    discount_percentage: 0,
    stock: 180,
    rating: 4.3,
    category_id: 'cat_vegetables',
    image_urls: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_veg_8',
    name: 'Organic Potato (Aloo) (Blinkit)',
    description: '100% certified organic potatoes. Earthy taste and pesticide-free. Sourced from Blinkit.',
    price: 42,
    discount_percentage: 12,
    stock: 140,
    rating: 4.6,
    category_id: 'cat_vegetables',
    image_urls: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_veg_9',
    name: 'Red Onions (Pyaaz) (JioMart)',
    description: 'Fresh red onions, ideal base for all culinary dishes. Sourced from JioMart.',
    price: 29,
    discount_percentage: 0,
    stock: 400,
    rating: 4.2,
    category_id: 'cat_vegetables',
    image_urls: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_veg_10',
    name: 'Onion (Fresho Organic) (Swiggy Instamart)',
    description: 'Premium quality organic red onions, sourced from regional farms. Sourced from Swiggy Instamart.',
    price: 35,
    discount_percentage: 8,
    stock: 250,
    rating: 4.4,
    category_id: 'cat_vegetables',
    image_urls: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_veg_11',
    name: 'Onion (Zepto)',
    description: 'Crisp red onions sorted for quality. Sourced from Zepto.',
    price: 32,
    discount_percentage: 0,
    stock: 200,
    rating: 4.3,
    category_id: 'cat_vegetables',
    image_urls: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_veg_12',
    name: 'Spring Onion (with Roots) (Blinkit)',
    description: 'Crisp green spring onions, perfect for Chinese stir-fry and garnishing. Sourced from Blinkit.',
    price: 45,
    discount_percentage: 10,
    stock: 90,
    rating: 4.5,
    category_id: 'cat_vegetables',
    image_urls: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },

  // --- Fruits ---
  {
    id: 'fb_fruit_1',
    name: 'Banana (Yelakki Premium) (JioMart)',
    description: 'Small, sweet Yelakki bananas from Southern India. Sourced from JioMart.',
    price: 65,
    discount_percentage: 0,
    stock: 100,
    rating: 4.5,
    category_id: 'cat_fruits',
    image_urls: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_fruit_2',
    name: 'Banana (Robusta Premium) (Swiggy Instamart)',
    description: 'Large Robusta variety bananas. A great source of potassium. Sourced from Swiggy Instamart.',
    price: 52,
    discount_percentage: 10,
    stock: 150,
    rating: 4.3,
    category_id: 'cat_fruits',
    image_urls: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_fruit_3',
    name: 'Banana (Zepto)',
    description: 'Handpicked fresh bananas, rich in energy. Sourced from Zepto.',
    price: 58,
    discount_percentage: 5,
    stock: 120,
    rating: 4.4,
    category_id: 'cat_fruits',
    image_urls: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_fruit_4',
    name: 'Ripe Bananas (Robusta) (Blinkit)',
    description: 'Perfectly yellow bananas, handpicked and delivered ready to eat. Sourced from Blinkit.',
    price: 59,
    discount_percentage: 0,
    stock: 110,
    rating: 4.4,
    category_id: 'cat_fruits',
    image_urls: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_fruit_5',
    name: 'Royal Gala Apples (JioMart)',
    description: 'Imported Royal Gala apples, crispy texture and mild sweet taste. Sourced from JioMart.',
    price: 139,
    discount_percentage: 15,
    stock: 80,
    rating: 4.4,
    category_id: 'cat_fruits',
    image_urls: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_fruit_6',
    name: 'Washington Red Apples (Swiggy Instamart)',
    description: 'Classic crunchy Washington state apples, rich color and sweet juice. Sourced from Swiggy Instamart.',
    price: 159,
    discount_percentage: 10,
    stock: 75,
    rating: 4.6,
    category_id: 'cat_fruits',
    image_urls: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_fruit_7',
    name: 'Shimla Red Apples (Zepto)',
    description: 'Sweet, crisp Shimla apples sourced directly from Himachal Pradesh. Sourced from Zepto.',
    price: 149,
    discount_percentage: 5,
    stock: 90,
    rating: 4.5,
    category_id: 'cat_fruits',
    image_urls: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_fruit_8',
    name: 'Shimla Red Apples (Premium) (Blinkit)',
    description: 'Indias favorite Shimla apples. Farm-fresh crisp quality. Sourced from Blinkit.',
    price: 189,
    discount_percentage: 8,
    stock: 60,
    rating: 4.8,
    category_id: 'cat_fruits',
    image_urls: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },

  // --- Dairy & Eggs ---
  {
    id: 'fb_dairy_1',
    name: 'Amul Taaza Milk (Toned) (JioMart)',
    description: 'Pasteurized toned milk, rich in calcium and vitamins. Sourced from JioMart.',
    price: 54,
    discount_percentage: 0,
    stock: 200,
    rating: 4.7,
    category_id: 'cat_dairy',
    image_urls: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_dairy_2',
    name: 'Amul Gold Milk (Full Cream) (Swiggy Instamart)',
    description: 'Thick full cream milk, perfect for tea, coffee, and desserts. Sourced from Swiggy Instamart.',
    price: 66,
    discount_percentage: 0,
    stock: 180,
    rating: 4.8,
    category_id: 'cat_dairy',
    image_urls: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_dairy_3',
    name: 'Mother Dairy Toned Milk (Zepto)',
    description: 'Fresh chilled toned milk. Sourced from Zepto.',
    price: 56,
    discount_percentage: 0,
    stock: 150,
    rating: 4.6,
    category_id: 'cat_dairy',
    image_urls: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_dairy_4',
    name: 'Mother Dairy Toned Milk (Blinkit)',
    description: 'Fresh chilled toned milk. Delivered cold within minutes. Sourced from Blinkit.',
    price: 56,
    discount_percentage: 0,
    stock: 160,
    rating: 4.7,
    category_id: 'cat_dairy',
    image_urls: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_dairy_5',
    name: 'Amul Butter (Salted) (JioMart)',
    description: 'Classic salted table butter. Spread it on toast or melt it on parathas. Sourced from JioMart.',
    price: 265,
    discount_percentage: 5,
    stock: 90,
    rating: 4.9,
    category_id: 'cat_dairy',
    image_urls: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_dairy_6',
    name: 'Amul Butter (Pasteurized) (Swiggy Instamart)',
    description: 'Pure dairy butter, gold standard of taste across India. Sourced from Swiggy Instamart.',
    price: 275,
    discount_percentage: 5,
    stock: 80,
    rating: 4.9,
    category_id: 'cat_dairy',
    image_urls: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_dairy_7',
    name: 'Amul Butter (Zepto)',
    description: 'Pure pasteurized salted butter. Sourced from Zepto.',
    price: 275,
    discount_percentage: 5,
    stock: 85,
    rating: 4.9,
    category_id: 'cat_dairy',
    image_urls: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_dairy_8',
    name: 'Nutralite Table Spread (Blinkit)',
    description: 'Cholesterol-free healthy table spread. Packed with Vitamin A, D & E. Sourced from Blinkit.',
    price: 230,
    discount_percentage: 8,
    stock: 110,
    rating: 4.5,
    category_id: 'cat_dairy',
    image_urls: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

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

    try {
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

      if (products.length > 0) {
        return { products: products as Product[], total };
      }
    } catch (err) {
      console.warn("⚠️ Database query failed, falling back to mock products:", err instanceof Error ? err.message : err);
    }

    // Return filtered fallback products
    let filtered = [...FALLBACK_PRODUCTS];
    if (category) {
      filtered = filtered.filter(p => p.category_id === category);
    }

    // Apply sorting
    if (sort === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating' || sort === '-rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'discount' || sort === '-discount') {
      filtered.sort((a, b) => b.discount_percentage - a.discount_percentage);
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    return { products: paginated as Product[], total };
  }

  static async getProductById(productId: string): Promise<Product | null> {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (product) return product as Product;
    } catch {}

    const found = FALLBACK_PRODUCTS.find(p => p.id === productId);
    return (found as Product) || null;
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
    try {
      const categories = await prisma.category.findMany({
        where: { is_active: true },
        orderBy: { name: 'asc' },
      });
      if (categories.length > 0) return categories;
    } catch {}

    return FALLBACK_CATEGORIES;
  }

  static async searchProducts(query: string, limit: number = 20): Promise<Product[]> {
    try {
      const products = await prisma.product.findMany({
        where: {
          is_active: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
      });
      if (products.length > 0) return products as Product[];
    } catch {}

    const q = query.toLowerCase();
    const matches = FALLBACK_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
    return matches.slice(0, limit) as Product[];
  }
}
