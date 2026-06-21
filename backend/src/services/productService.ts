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
  veg_nonveg: string;
  weight: string;
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
    veg_nonveg: 'veg',
    weight: '1 kg',
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
    veg_nonveg: 'veg',
    weight: '1 kg',
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
    veg_nonveg: 'veg',
    weight: '500 g',
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
    veg_nonveg: 'veg',
    weight: '500 g',
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
    veg_nonveg: 'veg',
    weight: '1 kg',
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
    veg_nonveg: 'veg',
    weight: '1 kg',
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
    veg_nonveg: 'veg',
    weight: '1 kg',
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
    veg_nonveg: 'veg',
    weight: '1 kg',
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
    veg_nonveg: 'veg',
    weight: '1 kg',
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
    veg_nonveg: 'veg',
    weight: '1 kg',
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
    veg_nonveg: 'veg',
    weight: '1 kg',
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
    veg_nonveg: 'veg',
    weight: '250 g',
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
    veg_nonveg: 'veg',
    weight: '500 g',
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
    veg_nonveg: 'veg',
    weight: '1 kg',
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
    veg_nonveg: 'veg',
    weight: '6 pcs',
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
    veg_nonveg: 'veg',
    weight: '6 pcs',
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
    veg_nonveg: 'veg',
    weight: '600 g',
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
    veg_nonveg: 'veg',
    weight: '4 pcs',
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
    veg_nonveg: 'veg',
    weight: '4 pcs',
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
    veg_nonveg: 'veg',
    weight: '4 pcs',
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
    veg_nonveg: 'veg',
    weight: '1 L',
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
    veg_nonveg: 'veg',
    weight: '1 L',
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
    veg_nonveg: 'veg',
    weight: '500 mL',
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
    veg_nonveg: 'veg',
    weight: '1 L',
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
    veg_nonveg: 'veg',
    weight: '500 g',
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
    veg_nonveg: 'veg',
    weight: '500 g',
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
    veg_nonveg: 'veg',
    weight: '500 g',
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
    veg_nonveg: 'veg',
    weight: '500 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_dairy_9',
    name: 'Farm Fresh Eggs (6 pcs) (JioMart)',
    description: 'Farm-fresh white eggs, rich in protein. Ideal for breakfast and baking. Sourced from JioMart.',
    price: 72,
    discount_percentage: 0,
    stock: 200,
    rating: 4.6,
    category_id: 'cat_dairy',
    image_urls: ['https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'nonveg',
    weight: '6 pcs',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_dairy_10',
    name: 'Amul Dahi (Fresh Curd) (Swiggy Instamart)',
    description: 'Thick, creamy curd with a tangy taste. Made from full-fat milk. Sourced from Swiggy Instamart.',
    price: 45,
    discount_percentage: 0,
    stock: 130,
    rating: 4.7,
    category_id: 'cat_dairy',
    image_urls: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '400 g',
    created_at: new Date(),
    updated_at: new Date()
  },

  // --- Bakery ---
  {
    id: 'fb_bakery_1',
    name: 'Britannia Brown Bread (JioMart)',
    description: 'Soft whole wheat brown bread, great for sandwiches and toast. Sourced from JioMart.',
    price: 40,
    discount_percentage: 0,
    stock: 150,
    rating: 4.4,
    category_id: 'cat_bakery',
    image_urls: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '400 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_bakery_2',
    name: 'Harvest Gold White Bread (Blinkit)',
    description: 'Soft, fluffy white sandwich bread with a mild, slightly sweet flavor. Sourced from Blinkit.',
    price: 35,
    discount_percentage: 0,
    stock: 200,
    rating: 4.3,
    category_id: 'cat_bakery',
    image_urls: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '400 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_bakery_3',
    name: 'Multigrain Bread (Zepto)',
    description: 'Nutritious multigrain bread with seeds and grains. High in fiber and protein. Sourced from Zepto.',
    price: 55,
    discount_percentage: 5,
    stock: 80,
    rating: 4.5,
    category_id: 'cat_bakery',
    image_urls: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '400 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_bakery_4',
    name: 'Croissant Butter (4 pcs) (Swiggy Instamart)',
    description: 'Flaky, golden butter croissants. Freshly baked every morning. Sourced from Swiggy Instamart.',
    price: 120,
    discount_percentage: 10,
    stock: 60,
    rating: 4.7,
    category_id: 'cat_bakery',
    image_urls: ['https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '240 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_bakery_5',
    name: 'Chocolate Muffins (6 pcs) (JioMart)',
    description: 'Moist, rich chocolate muffins with chocolate chips. Perfect for a sweet snack. Sourced from JioMart.',
    price: 149,
    discount_percentage: 15,
    stock: 70,
    rating: 4.6,
    category_id: 'cat_bakery',
    image_urls: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '300 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_bakery_6',
    name: 'Pav Buns (8 pcs) (Blinkit)',
    description: 'Soft, fluffy dinner pav rolls. Best paired with bhaji or used as burger buns. Sourced from Blinkit.',
    price: 30,
    discount_percentage: 0,
    stock: 200,
    rating: 4.4,
    category_id: 'cat_bakery',
    image_urls: ['https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '200 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_bakery_7',
    name: 'Blueberry Cheesecake (Zepto)',
    description: 'Creamy New York style cheesecake with fresh blueberry compote topping. Sourced from Zepto.',
    price: 349,
    discount_percentage: 12,
    stock: 30,
    rating: 4.8,
    category_id: 'cat_bakery',
    image_urls: ['https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '500 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_bakery_8',
    name: 'Rusk Toast (Britannia) (Swiggy Instamart)',
    description: 'Crunchy, double-baked rusk perfect with chai. Zero maida, baked light. Sourced from Swiggy Instamart.',
    price: 60,
    discount_percentage: 0,
    stock: 180,
    rating: 4.5,
    category_id: 'cat_bakery',
    image_urls: ['https://images.unsplash.com/photo-1602351447937-745cb720612f?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '250 g',
    created_at: new Date(),
    updated_at: new Date()
  },

  // --- Beverages ---
  {
    id: 'fb_bev_1',
    name: 'Tropicana Orange Juice (JioMart)',
    description: '100% real orange juice with no added sugar or preservatives. Rich in Vitamin C. Sourced from JioMart.',
    price: 99,
    discount_percentage: 10,
    stock: 120,
    rating: 4.5,
    category_id: 'cat_beverages',
    image_urls: ['https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '1 L',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_bev_2',
    name: 'Real Guava Juice (Blinkit)',
    description: 'Thick guava nectar with a tropical burst. 25% real guava pulp. Sourced from Blinkit.',
    price: 85,
    discount_percentage: 0,
    stock: 90,
    rating: 4.3,
    category_id: 'cat_beverages',
    image_urls: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '1 L',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_bev_3',
    name: 'Coca-Cola 750 mL (Zepto)',
    description: 'Chilled, refreshing Coca-Cola. Perfect for meals and celebrations. Sourced from Zepto.',
    price: 42,
    discount_percentage: 0,
    stock: 300,
    rating: 4.6,
    category_id: 'cat_beverages',
    image_urls: ['https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '750 mL',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_bev_4',
    name: 'Bisleri Mineral Water (Swiggy Instamart)',
    description: 'Pure, safe drinking water. Packaged at source with 8-stage purification. Sourced from Swiggy Instamart.',
    price: 20,
    discount_percentage: 0,
    stock: 500,
    rating: 4.4,
    category_id: 'cat_beverages',
    image_urls: ['https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '1 L',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_bev_5',
    name: 'Red Bull Energy Drink (JioMart)',
    description: 'Vitalizes body and mind. Contains caffeine, taurine, B-vitamins and sugars. Sourced from JioMart.',
    price: 130,
    discount_percentage: 5,
    stock: 150,
    rating: 4.5,
    category_id: 'cat_beverages',
    image_urls: ['https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '250 mL',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_bev_6',
    name: 'Tata Tea Gold (250 g) (Blinkit)',
    description: 'Premium Assam blend with fine Darjeeling leaves for a rich, aromatic cup. Sourced from Blinkit.',
    price: 118,
    discount_percentage: 8,
    stock: 200,
    rating: 4.7,
    category_id: 'cat_beverages',
    image_urls: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '250 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_bev_7',
    name: 'Nescafe Classic Instant Coffee (Zepto)',
    description: 'Smooth, aromatic instant coffee. Made from select Arabica and Robusta coffee beans. Sourced from Zepto.',
    price: 199,
    discount_percentage: 10,
    stock: 100,
    rating: 4.6,
    category_id: 'cat_beverages',
    image_urls: ['https://images.unsplash.com/photo-1621592484082-4a1d977bbbde?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '100 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_bev_8',
    name: 'Limca Lemon Lime (Swiggy Instamart)',
    description: 'Zingy lemon-lime drink with a refreshing fizz. Best served chilled. Sourced from Swiggy Instamart.',
    price: 40,
    discount_percentage: 0,
    stock: 250,
    rating: 4.4,
    category_id: 'cat_beverages',
    image_urls: ['https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '750 mL',
    created_at: new Date(),
    updated_at: new Date()
  },

  // --- Snacks ---
  {
    id: 'fb_snack_1',
    name: "Lay's Classic Salted Chips (JioMart)",
    description: "Crispy potato chips with just the right amount of salt. Perfect munch for any occasion. Sourced from JioMart.",
    price: 20,
    discount_percentage: 0,
    stock: 300,
    rating: 4.5,
    category_id: 'cat_snacks',
    image_urls: ['https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '50 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_snack_2',
    name: 'Haldiram Aloo Bhujia (Blinkit)',
    description: 'Crispy, spiced aloo bhujia — a classic Indian snack. Great with tea or as a topping. Sourced from Blinkit.',
    price: 60,
    discount_percentage: 5,
    stock: 200,
    rating: 4.7,
    category_id: 'cat_snacks',
    image_urls: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '200 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_snack_3',
    name: 'Maggi Noodles 2-Minute (Zepto)',
    description: 'Indias most loved masala noodles. Ready in 2 minutes, anytime snack. Sourced from Zepto.',
    price: 14,
    discount_percentage: 0,
    stock: 500,
    rating: 4.8,
    category_id: 'cat_snacks',
    image_urls: ['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '70 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_snack_4',
    name: 'Bingo Mad Angles (Swiggy Instamart)',
    description: 'Triangular chips dusted with tangy spices. An addictive crunchy snack. Sourced from Swiggy Instamart.',
    price: 20,
    discount_percentage: 0,
    stock: 250,
    rating: 4.5,
    category_id: 'cat_snacks',
    image_urls: ['https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '60 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_snack_5',
    name: 'Oreo Chocolate Sandwich Cookies (JioMart)',
    description: 'Classic chocolate biscuits with rich cream filling. Twist, lick, dunk! Sourced from JioMart.',
    price: 30,
    discount_percentage: 0,
    stock: 300,
    rating: 4.7,
    category_id: 'cat_snacks',
    image_urls: ['https://images.unsplash.com/photo-1590080875852-4f3a3e0da24e?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '120 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_snack_6',
    name: 'Mixed Nuts & Dry Fruits (Blinkit)',
    description: 'Premium mix of almonds, cashews, raisins, and pistachios. A healthy, energy-rich snack. Sourced from Blinkit.',
    price: 299,
    discount_percentage: 12,
    stock: 100,
    rating: 4.6,
    category_id: 'cat_snacks',
    image_urls: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '500 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_snack_7',
    name: 'Good Day Cashew Cookies (Zepto)',
    description: 'Buttery shortbread cookies loaded with whole cashews. A teatime favorite since 1986. Sourced from Zepto.',
    price: 35,
    discount_percentage: 0,
    stock: 220,
    rating: 4.5,
    category_id: 'cat_snacks',
    image_urls: ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '150 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_snack_8',
    name: 'Popcorn Butter Flavour (Swiggy Instamart)',
    description: 'Light and fluffy microwave popcorn with rich buttery taste. Movie-night essential. Sourced from Swiggy Instamart.',
    price: 55,
    discount_percentage: 10,
    stock: 180,
    rating: 4.4,
    category_id: 'cat_snacks',
    image_urls: ['https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '100 g',
    created_at: new Date(),
    updated_at: new Date()
  },

  // --- Personal Care ---
  {
    id: 'fb_personal_1',
    name: 'Dove Moisturising Body Wash (JioMart)',
    description: 'Gentle, creamy body wash with 1/4 moisturising cream. Leaves skin soft and smooth. Sourced from JioMart.',
    price: 249,
    discount_percentage: 15,
    stock: 120,
    rating: 4.7,
    category_id: 'cat_personal',
    image_urls: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '250 mL',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_personal_2',
    name: 'Head & Shoulders Anti-Dandruff Shampoo (Blinkit)',
    description: 'Clinically proven anti-dandruff protection. Leaves hair clean, fresh, and dandruff-free. Sourced from Blinkit.',
    price: 299,
    discount_percentage: 10,
    stock: 100,
    rating: 4.6,
    category_id: 'cat_personal',
    image_urls: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '340 mL',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_personal_3',
    name: 'Colgate MaxFresh Toothpaste (Zepto)',
    description: 'Cooling gel toothpaste with green tea extracts for long-lasting fresh breath. Sourced from Zepto.',
    price: 99,
    discount_percentage: 5,
    stock: 200,
    rating: 4.5,
    category_id: 'cat_personal',
    image_urls: ['https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '150 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_personal_4',
    name: 'Gillette Mach3 Razor (Swiggy Instamart)',
    description: '3-blade shaving system with Microfin skin guard. Closest, most comfortable shave. Sourced from Swiggy Instamart.',
    price: 225,
    discount_percentage: 8,
    stock: 90,
    rating: 4.7,
    category_id: 'cat_personal',
    image_urls: ['https://images.unsplash.com/photo-1621607510248-fa7b8e3e8f4b?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '1 pcs',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_personal_5',
    name: 'Nivea Soft Moisturising Cream (JioMart)',
    description: 'Light and refreshing cream with Jojoba Oil and Vitamin E for instantly soft skin. Sourced from JioMart.',
    price: 189,
    discount_percentage: 12,
    stock: 130,
    rating: 4.6,
    category_id: 'cat_personal',
    image_urls: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '200 mL',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_personal_6',
    name: 'Dettol Original Soap (Blinkit)',
    description: 'Antibacterial protection with 100-year trusted formula. Kills 99.9% of germs. Sourced from Blinkit.',
    price: 49,
    discount_percentage: 0,
    stock: 300,
    rating: 4.8,
    category_id: 'cat_personal',
    image_urls: ['https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '75 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_personal_7',
    name: 'Lakme Lip Color (Zepto)',
    description: 'Long-lasting matte lipstick enriched with Vitamin E. Available in vibrant shades. Sourced from Zepto.',
    price: 299,
    discount_percentage: 20,
    stock: 60,
    rating: 4.5,
    category_id: 'cat_personal',
    image_urls: ['https://images.unsplash.com/photo-1586495777744-4e6232bf2abb?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '3.6 g',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_personal_8',
    name: 'Whisper Ultra Clean Pads (Swiggy Instamart)',
    description: 'Ultra-thin pads with advanced absorption technology for rash-free comfort. Sourced from Swiggy Instamart.',
    price: 120,
    discount_percentage: 10,
    stock: 200,
    rating: 4.7,
    category_id: 'cat_personal',
    image_urls: ['https://images.unsplash.com/photo-1576016768699-def11f99af7d?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '15 pcs',
    created_at: new Date(),
    updated_at: new Date()
  },

  // --- Household ---
  {
    id: 'fb_house_1',
    name: 'Vim Dishwash Liquid (JioMart)',
    description: 'Powerful grease-cutting dishwash liquid with the goodness of lemon. Sourced from JioMart.',
    price: 89,
    discount_percentage: 0,
    stock: 200,
    rating: 4.6,
    category_id: 'cat_household',
    image_urls: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '500 mL',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_house_2',
    name: 'Surf Excel Easy Wash Detergent (Blinkit)',
    description: 'Quick dissolving detergent powder that removes tough stains in less water. Sourced from Blinkit.',
    price: 179,
    discount_percentage: 8,
    stock: 150,
    rating: 4.7,
    category_id: 'cat_household',
    image_urls: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '1 kg',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_house_3',
    name: 'Harpic Power Plus Toilet Cleaner (Zepto)',
    description: '10x more power to clean tough stains. Kills 99.9% of germs and removes limescale. Sourced from Zepto.',
    price: 99,
    discount_percentage: 5,
    stock: 180,
    rating: 4.7,
    category_id: 'cat_household',
    image_urls: ['https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '500 mL',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_house_4',
    name: 'Good Knight Fast Card (Swiggy Instamart)',
    description: 'Fast-acting mosquito repellent card. Fights mosquitoes for 4 hours. No smoke, no mess. Sourced from Swiggy Instamart.',
    price: 45,
    discount_percentage: 0,
    stock: 250,
    rating: 4.5,
    category_id: 'cat_household',
    image_urls: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '10 pcs',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_house_5',
    name: 'Scotch-Brite Scrub Pad (JioMart)',
    description: 'Extra-thick scrubbing pad for tough stains on pots and pans. Long-lasting and hygienic. Sourced from JioMart.',
    price: 49,
    discount_percentage: 0,
    stock: 300,
    rating: 4.5,
    category_id: 'cat_household',
    image_urls: ['https://images.unsplash.com/photo-1603251578711-3290595e5c72?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '3 pcs',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_house_6',
    name: 'Colin Glass Cleaner (Blinkit)',
    description: 'Streak-free glass cleaner for windows, mirrors, and surfaces. Ready-to-use spray. Sourced from Blinkit.',
    price: 119,
    discount_percentage: 10,
    stock: 130,
    rating: 4.4,
    category_id: 'cat_household',
    image_urls: ['https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '500 mL',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_house_7',
    name: 'Ariel Matic Top Load Detergent (Zepto)',
    description: 'Specially formulated for top-load washing machines. Removes 100+ stains. Sourced from Zepto.',
    price: 249,
    discount_percentage: 15,
    stock: 100,
    rating: 4.6,
    category_id: 'cat_household',
    image_urls: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '1 kg',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'fb_house_8',
    name: 'Garbage Bags Medium (Swiggy Instamart)',
    description: 'Strong, leak-proof garbage bags with drawstring closure. Easy disposal with no mess. Sourced from Swiggy Instamart.',
    price: 99,
    discount_percentage: 0,
    stock: 200,
    rating: 4.4,
    category_id: 'cat_household',
    image_urls: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80'],
    is_active: true,
    veg_nonveg: 'veg',
    weight: '30 pcs',
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
        veg_nonveg: data.veg_nonveg || 'veg',
        weight: data.weight || '',
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
        veg_nonveg: data.veg_nonveg,
        weight: data.weight,
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
