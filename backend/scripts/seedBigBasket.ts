import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BigBasketRow {
  ProductName: string;
  Brand: string;
  Price: string;
  DiscountPrice: string;
  Image_Url: string;
  Quantity: string;
  Category: string;
  SubCategory: string;
  Absolute_Url: string;
}

const DATASET_PATH = '/Users/ankityadav/.cache/kagglehub/datasets/chinmayshanbhag/big-basket-products/versions/1/BigBasket.csv';

// Map generic categories to quick-mart specific categories where possible
const categoryMap: Record<string, { id: string; name: string; description: string; image_url: string }> = {
  'Fruits & Vegetables': {
    id: 'cat_vegetables',
    name: 'Vegetables & Fruits',
    description: 'Fresh farm vegetables and seasonal fruits',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&q=80',
  },
  'Bakery, Cakes & Dairy': {
    id: 'cat_dairy_bakery',
    name: 'Dairy & Bakery',
    description: 'Fresh milk, cheese, and baked goods',
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&q=80',
  },
  'Beverages': {
    id: 'cat_beverages',
    name: 'Beverages',
    description: 'Juices, soft drinks, water and energy drinks',
    image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&q=80',
  },
  'Snacks & Branded Foods': {
    id: 'cat_snacks',
    name: 'Snacks & Branded Foods',
    description: 'Chips, cookies, nuts and healthy snacks',
    image_url: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=200&q=80',
  },
  'Beauty & Hygiene': {
    id: 'cat_personal',
    name: 'Beauty & Hygiene',
    description: 'Skincare, soap, and hygiene products',
    image_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=80',
  },
  'Cleaning & Household': {
    id: 'cat_household',
    name: 'Cleaning & Household',
    description: 'Cleaning supplies and home essentials',
    image_url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&q=80',
  },
  'Foodgrains, Oil & Masala': {
    id: 'cat_grocery',
    name: 'Foodgrains, Oil & Masala',
    description: 'Daily grocery staples, pulses, and spices',
    image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&q=80',
  },
  'Gourmet & World Food': {
    id: 'cat_gourmet',
    name: 'Gourmet & World Food',
    description: 'Imported and premium world foods',
    image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&q=80',
  },
  'Baby Care': {
    id: 'cat_baby',
    name: 'Baby Care',
    description: 'Diapers, baby food, and accessories',
    image_url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=200&q=80',
  },
  'Eggs, Meat & Fish': {
    id: 'cat_meat',
    name: 'Eggs, Meat & Fish',
    description: 'Fresh meats, seafood and farm eggs',
    image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&q=80',
  }
};

async function main() {
  if (!fs.existsSync(DATASET_PATH)) {
    console.error(`Dataset not found at ${DATASET_PATH}`);
    console.error('Please run the Kaggle download script first.');
    process.exit(1);
  }

  console.log('Clearing existing categories and products...');
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  console.log('Existing data cleared.');

  // Extract unique categories from dataset and insert them
  console.log('Seeding categories...');
  const categoryIdMap = new Map<string, string>(); // Mapping original category string to inserted ObjectId

  for (const [key, catData] of Object.entries(categoryMap)) {
    const newCat = await prisma.category.create({
      data: {
        name: catData.name,
        description: catData.description,
        image_url: catData.image_url,
        is_active: true,
      }
    });
    categoryIdMap.set(key, newCat.id);
  }

  const productsToInsert: any[] = [];
  let rowCount = 0;
  let skippedNoImage = 0;

  console.log('Reading CSV and mapping products...');
  
  await new Promise((resolve, reject) => {
    fs.createReadStream(DATASET_PATH)
      .pipe(csv())
      .on('data', (row: BigBasketRow) => {
        rowCount++;
        
        // Skip products without images to keep UI looking nice
        if (!row.Image_Url || row.Image_Url.trim() === '') {
          skippedNoImage++;
          return;
        }

        const categoryId = categoryIdMap.get(row.Category);
        if (!categoryId) {
          // If category isn't in our predefined map, skip or fallback
          return;
        }

        const price = parseFloat(row.Price) || 0;
        const discountPrice = parseFloat(row.DiscountPrice) || price;
        const discountPercentage = price > 0 ? Math.round(((price - discountPrice) / price) * 100) : 0;
        const name = row.ProductName.trim() || 'Unknown Product';
        const brandStr = row.Brand.trim() !== '' ? `[${row.Brand}] ` : '';
        const description = `${brandStr}${row.SubCategory}. Source: BigBasket.`;

        // Determine if veg/non-veg roughly
        let vegNonVeg = 'veg';
        if (row.Category.toLowerCase().includes('meat') || row.Category.toLowerCase().includes('fish')) {
          vegNonVeg = 'non_veg';
        }

        productsToInsert.push({
          name: name,
          description: description,
          price: price,
          discount_percentage: discountPercentage,
          stock: Math.floor(Math.random() * 200) + 10, // Random stock between 10 and 210
          rating: Number((Math.random() * (5.0 - 3.5) + 3.5).toFixed(1)), // Random rating between 3.5 and 5.0
          image_urls: [row.Image_Url],
          category_id: categoryId,
          is_active: true,
          veg_nonveg: vegNonVeg,
          weight: row.Quantity || '1 pc',
          created_at: new Date(),
          updated_at: new Date()
        });
      })
      .on('end', () => {
        resolve(null);
      })
      .on('error', (err) => {
        reject(err);
      });
  });

  console.log(`Parsed ${rowCount} rows. Skipped ${skippedNoImage} without images.`);
  console.log(`Inserting ${productsToInsert.length} products...`);

  // Prisma createMany is efficient, but we should chunk it just in case it hits limits
  const CHUNK_SIZE = 5000;
  for (let i = 0; i < productsToInsert.length; i += CHUNK_SIZE) {
    const chunk = productsToInsert.slice(i, i + CHUNK_SIZE);
    await prisma.product.createMany({
      data: chunk
    });
    console.log(`Inserted chunk ${i / CHUNK_SIZE + 1} (${chunk.length} items)...`);
  }

  console.log('✅ Successfully seeded BigBasket data!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
