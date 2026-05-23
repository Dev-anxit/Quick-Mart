import { prisma } from '../config/prisma';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Create categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { name: 'Vegetables' },
        update: {},
        create: {
          name: 'Vegetables',
          description: 'Fresh vegetables',
          image_url: 'https://via.placeholder.com/300?text=Vegetables',
          is_active: true,
        },
      }),
      prisma.category.upsert({
        where: { name: 'Fruits' },
        update: {},
        create: {
          name: 'Fruits',
          description: 'Fresh fruits',
          image_url: 'https://via.placeholder.com/300?text=Fruits',
          is_active: true,
        },
      }),
      prisma.category.upsert({
        where: { name: 'Dairy' },
        update: {},
        create: {
          name: 'Dairy',
          description: 'Dairy products',
          image_url: 'https://via.placeholder.com/300?text=Dairy',
          is_active: true,
        },
      }),
      prisma.category.upsert({
        where: { name: 'Bakery' },
        update: {},
        create: {
          name: 'Bakery',
          description: 'Bakery items',
          image_url: 'https://via.placeholder.com/300?text=Bakery',
          is_active: true,
        },
      }),
    ]);

    console.log('✅ Categories created');

    // Create sample products
    const products = [
      {
        name: 'Tomatoes',
        description: 'Fresh red tomatoes',
        price: 40,
        discount_percentage: 10,
        stock: 100,
        category_id: categories[0].id,
        image_urls: ['https://via.placeholder.com/300?text=Tomatoes'],
      },
      {
        name: 'Carrots',
        description: 'Fresh orange carrots',
        price: 35,
        discount_percentage: 5,
        stock: 80,
        category_id: categories[0].id,
        image_urls: ['https://via.placeholder.com/300?text=Carrots'],
      },
      {
        name: 'Apples',
        description: 'Fresh red apples',
        price: 80,
        discount_percentage: 15,
        stock: 120,
        category_id: categories[1].id,
        image_urls: ['https://via.placeholder.com/300?text=Apples'],
      },
      {
        name: 'Bananas',
        description: 'Fresh bananas',
        price: 50,
        discount_percentage: 10,
        stock: 150,
        category_id: categories[1].id,
        image_urls: ['https://via.placeholder.com/300?text=Bananas'],
      },
      {
        name: 'Milk (1L)',
        description: 'Fresh cow milk',
        price: 60,
        discount_percentage: 0,
        stock: 200,
        category_id: categories[2].id,
        image_urls: ['https://via.placeholder.com/300?text=Milk'],
      },
      {
        name: 'Bread',
        description: 'Fresh white bread',
        price: 40,
        discount_percentage: 5,
        stock: 50,
        category_id: categories[3].id,
        image_urls: ['https://via.placeholder.com/300?text=Bread'],
      },
    ];

    await Promise.all(
      products.map((product) =>
        prisma.product.upsert({
          where: { name: product.name },
          update: {},
          create: product,
        })
      )
    );

    console.log('✅ Products created');

    // Create promo codes
    await prisma.promo.upsert({
      where: { code: 'WELCOME10' },
      update: {},
      create: {
        code: 'WELCOME10',
        discount_percentage: 10,
        max_discount: 100,
        min_purchase: 200,
        usage_limit: 1000,
        is_active: true,
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    });

    console.log('✅ Promo codes created');
    console.log('🎉 Database seed completed successfully!');
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
