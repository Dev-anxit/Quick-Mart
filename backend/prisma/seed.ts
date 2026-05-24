import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { prisma } from '../src/config/prisma';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing data in correct order
    await prisma.orderItem.deleteMany();
    await prisma.orderTracking.deleteMany();
    await prisma.order.deleteMany();
    await prisma.review.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.promo.deleteMany();
    await prisma.riderLocation.deleteMany();
    await prisma.rider.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Create categories with real Unsplash images
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Vegetables',
          description: 'Fresh farm vegetables delivered daily',
          image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&q=80',
          is_active: true,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Fruits',
          description: 'Juicy seasonal and exotic fruits',
          image_url: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=200&q=80',
          is_active: true,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Dairy & Eggs',
          description: 'Fresh milk, cheese, yogurt and eggs',
          image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&q=80',
          is_active: true,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Bakery',
          description: 'Freshly baked breads, cakes and pastries',
          image_url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=200&q=80',
          is_active: true,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Beverages',
          description: 'Juices, soft drinks, water and energy drinks',
          image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&q=80',
          is_active: true,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Snacks',
          description: 'Chips, cookies, nuts and healthy snacks',
          image_url: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=200&q=80',
          is_active: true,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Personal Care',
          description: 'Shampoo, soap, skincare and hygiene products',
          image_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=80',
          is_active: true,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Household',
          description: 'Cleaning supplies and home essentials',
          image_url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&q=80',
          is_active: true,
        },
      }),
    ]);

    const [vegetables, fruits, dairy, bakery, beverages, snacks, personalCare, household] = categories;

    console.log('✅ Categories created');

    // Create products with real Unsplash images
    const productData = [
      // Vegetables
      {
        name: 'Fresh Tomatoes',
        description: 'Plump, juicy red tomatoes perfect for salads and cooking. Sourced daily from local farms.',
        price: 49,
        discount_percentage: 10,
        stock: 200,
        rating: 4.5,
        category_id: vegetables.id,
        image_urls: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80'],
      },
      {
        name: 'Baby Spinach',
        description: 'Tender baby spinach leaves, washed and ready to eat. Rich in iron and vitamins.',
        price: 59,
        discount_percentage: 0,
        stock: 150,
        rating: 4.7,
        category_id: vegetables.id,
        image_urls: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80'],
      },
      {
        name: 'Orange Carrots',
        description: 'Crunchy, sweet carrots great for cooking, juicing or eating raw.',
        price: 39,
        discount_percentage: 5,
        stock: 180,
        rating: 4.4,
        category_id: vegetables.id,
        image_urls: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80'],
      },
      {
        name: 'Bell Peppers (Mix)',
        description: 'Colorful mix of red, yellow and green bell peppers — sweet and crunchy.',
        price: 79,
        discount_percentage: 15,
        stock: 120,
        rating: 4.6,
        category_id: vegetables.id,
        image_urls: ['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80'],
      },
      {
        name: 'Broccoli',
        description: 'Farm-fresh green broccoli florets, packed with fiber and nutrients.',
        price: 69,
        discount_percentage: 0,
        stock: 100,
        rating: 4.3,
        category_id: vegetables.id,
        image_urls: ['https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80'],
      },
      {
        name: 'Onions (1kg)',
        description: 'Premium quality onions. A kitchen staple, essential for all Indian cooking.',
        price: 35,
        discount_percentage: 0,
        stock: 500,
        rating: 4.2,
        category_id: vegetables.id,
        image_urls: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80'],
      },
      // Fruits
      {
        name: 'Alphonso Mangoes',
        description: 'The king of mangoes! Sweet, aromatic Alphonso mangoes from Ratnagiri.',
        price: 199,
        discount_percentage: 10,
        stock: 80,
        rating: 4.9,
        category_id: fruits.id,
        image_urls: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80'],
      },
      {
        name: 'Red Apples (6 pcs)',
        description: 'Crisp and sweet imported red apples. Rich in fiber and antioxidants.',
        price: 149,
        discount_percentage: 20,
        stock: 120,
        rating: 4.6,
        category_id: fruits.id,
        image_urls: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80'],
      },
      {
        name: 'Bananas (12 pcs)',
        description: 'Ripe yellow bananas — nature\'s perfect energy snack. Great for smoothies.',
        price: 59,
        discount_percentage: 0,
        stock: 200,
        rating: 4.5,
        category_id: fruits.id,
        image_urls: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80'],
      },
      {
        name: 'Strawberries (250g)',
        description: 'Fresh, bright red strawberries. Sweet with a hint of tartness.',
        price: 129,
        discount_percentage: 5,
        stock: 60,
        rating: 4.8,
        category_id: fruits.id,
        image_urls: ['https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80'],
      },
      {
        name: 'Seedless Grapes (500g)',
        description: 'Juicy green seedless grapes. Perfect for snacking or fruit salads.',
        price: 99,
        discount_percentage: 0,
        stock: 90,
        rating: 4.4,
        category_id: fruits.id,
        image_urls: ['https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80'],
      },
      // Dairy & Eggs
      {
        name: 'Full Cream Milk (1L)',
        description: 'Fresh pasteurized full cream milk. Sourced from healthy, grass-fed cows.',
        price: 68,
        discount_percentage: 0,
        stock: 300,
        rating: 4.7,
        category_id: dairy.id,
        image_urls: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80'],
      },
      {
        name: 'Greek Yogurt (400g)',
        description: 'Thick, creamy Greek yogurt. High in protein, low in sugar.',
        price: 89,
        discount_percentage: 10,
        stock: 100,
        rating: 4.8,
        category_id: dairy.id,
        image_urls: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80'],
      },
      {
        name: 'Amul Butter (500g)',
        description: 'India\'s favourite butter. Perfect for spreading, cooking and baking.',
        price: 245,
        discount_percentage: 5,
        stock: 80,
        rating: 4.9,
        category_id: dairy.id,
        image_urls: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80'],
      },
      {
        name: 'Farm Fresh Eggs (12 pcs)',
        description: 'Fresh brown eggs from free-range hens. High in protein and omega-3.',
        price: 99,
        discount_percentage: 0,
        stock: 200,
        rating: 4.6,
        category_id: dairy.id,
        image_urls: ['https://images.unsplash.com/photo-1518569656558-1f25e69d2fd4?w=400&q=80'],
      },
      {
        name: 'Cheddar Cheese (200g)',
        description: 'Aged cheddar cheese with a sharp, tangy flavour. Great for burgers and sandwiches.',
        price: 179,
        discount_percentage: 0,
        stock: 60,
        rating: 4.5,
        category_id: dairy.id,
        image_urls: ['https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=400&q=80'],
      },
      // Bakery
      {
        name: 'Multigrain Bread',
        description: 'Wholesome multigrain loaf with seeds and grains. Healthy and hearty.',
        price: 55,
        discount_percentage: 0,
        stock: 80,
        rating: 4.4,
        category_id: bakery.id,
        image_urls: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80'],
      },
      {
        name: 'Croissants (4 pcs)',
        description: 'Buttery, flaky French croissants baked fresh every morning.',
        price: 149,
        discount_percentage: 0,
        stock: 40,
        rating: 4.7,
        category_id: bakery.id,
        image_urls: ['https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80'],
      },
      {
        name: 'Chocolate Muffins (2 pcs)',
        description: 'Indulgent chocolate chunk muffins with a moist crumb.',
        price: 89,
        discount_percentage: 10,
        stock: 50,
        rating: 4.8,
        category_id: bakery.id,
        image_urls: ['https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&q=80'],
      },
      // Beverages
      {
        name: 'Tropicana Orange Juice (1L)',
        description: '100% pure orange juice with no added sugar or preservatives.',
        price: 119,
        discount_percentage: 15,
        stock: 120,
        rating: 4.5,
        category_id: beverages.id,
        image_urls: ['https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80'],
      },
      {
        name: 'Mineral Water (1L)',
        description: 'Pure, refreshing mineral water sourced from natural springs.',
        price: 20,
        discount_percentage: 0,
        stock: 500,
        rating: 4.3,
        category_id: beverages.id,
        image_urls: ['https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80'],
      },
      {
        name: 'Cold Brew Coffee (250ml)',
        description: 'Premium cold brew coffee. Smooth, strong and ready to drink.',
        price: 89,
        discount_percentage: 0,
        stock: 60,
        rating: 4.7,
        category_id: beverages.id,
        image_urls: ['https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80'],
      },
      // Snacks
      {
        name: "Lay's Classic Chips (150g)",
        description: "Crispy salted potato chips. Perfect for snacking anytime.",
        price: 45,
        discount_percentage: 0,
        stock: 200,
        rating: 4.5,
        category_id: snacks.id,
        image_urls: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80'],
      },
      {
        name: 'Mixed Nuts (200g)',
        description: 'Premium blend of almonds, cashews, walnuts and pistachios.',
        price: 249,
        discount_percentage: 10,
        stock: 80,
        rating: 4.8,
        category_id: snacks.id,
        image_urls: ['https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80'],
      },
      {
        name: 'Dark Chocolate Bar (100g)',
        description: '70% cocoa dark chocolate. Rich, smooth and antioxidant-rich.',
        price: 129,
        discount_percentage: 5,
        stock: 100,
        rating: 4.9,
        category_id: snacks.id,
        image_urls: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80'],
      },
      {
        name: 'Granola Bars (Box of 6)',
        description: 'Oats and honey granola bars for a healthy on-the-go snack.',
        price: 179,
        discount_percentage: 0,
        stock: 60,
        rating: 4.4,
        category_id: snacks.id,
        image_urls: ['https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&q=80'],
      },
      // Personal Care
      {
        name: 'Head & Shoulders Shampoo (400ml)',
        description: 'Anti-dandruff shampoo for clean, flake-free hair.',
        price: 299,
        discount_percentage: 20,
        stock: 80,
        rating: 4.5,
        category_id: personalCare.id,
        image_urls: ['https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80'],
      },
      {
        name: 'Dove Soap (4 pack)',
        description: 'Moisturising beauty soap for soft, smooth skin.',
        price: 149,
        discount_percentage: 10,
        stock: 120,
        rating: 4.7,
        category_id: personalCare.id,
        image_urls: ['https://images.unsplash.com/photo-1631390993015-d40e32c63f4c?w=400&q=80'],
      },
      {
        name: 'Hand Sanitizer (500ml)',
        description: '70% alcohol hand sanitizer. Kills 99.9% of germs.',
        price: 99,
        discount_percentage: 0,
        stock: 200,
        rating: 4.3,
        category_id: personalCare.id,
        image_urls: ['https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&q=80'],
      },
      // Household
      {
        name: 'Surf Excel Detergent (2kg)',
        description: 'Tough stain remover laundry detergent. Works in cold water too.',
        price: 299,
        discount_percentage: 15,
        stock: 100,
        rating: 4.6,
        category_id: household.id,
        image_urls: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80'],
      },
      {
        name: 'Colin Glass Cleaner (500ml)',
        description: 'Streak-free glass and surface cleaner. Leaves surfaces sparkling.',
        price: 129,
        discount_percentage: 0,
        stock: 80,
        rating: 4.3,
        category_id: household.id,
        image_urls: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'],
      },
    ];

    await Promise.all(
      productData.map((product) =>
        prisma.product.create({ data: product })
      )
    );

    console.log(`✅ ${productData.length} products created`);

    // Create promo codes
    await Promise.all([
      prisma.promo.create({
        data: {
          code: 'WELCOME10',
          discount_percentage: 10,
          max_discount: 100,
          min_purchase: 99,
          usage_limit: 10000,
          is_active: true,
          expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
      }),
      prisma.promo.create({
        data: {
          code: 'FRESH20',
          discount_percentage: 20,
          max_discount: 150,
          min_purchase: 199,
          usage_limit: 5000,
          is_active: true,
          expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        },
      }),
      prisma.promo.create({
        data: {
          code: 'FLAT50',
          discount_percentage: 15,
          max_discount: 50,
          min_purchase: 499,
          usage_limit: 2000,
          is_active: true,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      }),
      prisma.promo.create({
        data: {
          code: 'FIRST100',
          discount_percentage: 25,
          max_discount: 100,
          min_purchase: 299,
          usage_limit: 1000,
          is_active: true,
          expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    console.log('✅ Promo codes created: WELCOME10, FRESH20, FLAT50, FIRST100');

    // Create a demo rider
    await prisma.rider.create({
      data: {
        name: 'Raj Kumar',
        phone: '9876543210',
        email: 'raj@quickmart.in',
        vehicle_type: 'bike',
        license_number: 'DL01AB1234',
        status: 'active',
        total_deliveries: 256,
        rating: 4.8,
      },
    });

    console.log('✅ Demo rider created');
    console.log('');
    console.log('🎉 Database seed completed successfully!');
    console.log('');
    console.log('📋 Test Promo Codes:');
    console.log('   WELCOME10 — 10% off (min ₹99)');
    console.log('   FRESH20   — 20% off (min ₹199)');
    console.log('   FLAT50    — 15% off up to ₹50 (min ₹499)');
    console.log('   FIRST100  — 25% off up to ₹100 (min ₹299)');
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
