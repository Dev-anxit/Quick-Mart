import { CategoryModel } from '../models/Category';
import { ProductModel } from '../models/Product';
import { PromoModel } from '../models/Promo';

export async function seedDatabase() {
  console.log("🚀 Starting Mega-Seed: Generating 5000+ Products...");

  try {
    // Clear existing data
    await Promise.all([CategoryModel.deleteMany({}), ProductModel.deleteMany({}), PromoModel.deleteMany({})]);

    const categoriesData = [
      { name: "Fruits & Vegetables", icon_url: "🥬", display_order: 1 },
      { name: "Dairy, Bread & Eggs", icon_url: "🥛", display_order: 2 },
      { name: "Snacks & Munchies", icon_url: "🍪", display_order: 3 },
      { name: "Cold Drinks & Juices", icon_url: "🥤", display_order: 4 },
      { name: "Sweet Tooth", icon_url: "🍫", display_order: 5 },
      { name: "Packaged Food", icon_url: "🥫", display_order: 6 },
      { name: "Sexual Wellness", icon_url: "💖", display_order: 7 },
      { name: "Toys & Games", icon_url: "🧸", display_order: 8 },
      { name: "Personal Care", icon_url: "🧴", display_order: 9 },
      { name: "Household Essentials", icon_url: "🧹", display_order: 10 },
    ];

    const categories = await CategoryModel.insertMany(categoriesData);
    console.log(`✅ Created ${categories.length} Categories`);

    const productPool: any = {
      "Fruits & Vegetables": ["Tomato", "Onion", "Potato", "Carrot", "Cabbage", "Spinach", "Apple", "Banana", "Grapes", "Mango", "Pomegranate", "Kiwi", "Broccoli", "Capsicum", "Cauliflower", "Ginger", "Garlic", "Lemon", "Cucumber", "Radish"],
      "Dairy, Bread & Eggs": ["Milk Packet", "Butter Block", "Fresh Curd", "Paneer Block", "Brown Eggs", "White Eggs", "Cheese Slices", "Whole Wheat Bread", "Greek Yogurt", "Desi Ghee", "Fresh Cream", "Buttermilk", "Condensed Milk"],
      "Snacks & Munchies": ["Potato Chips", "Masala Namkeen", "Chocolate Biscuits", "Butter Cookies", "Popcorn", "Roasted Peanuts", "Corn Nachos", "Almonds", "Cashews", "Maggi Masala Munch", "Kurkure", "Puff Snacks"],
      "Cold Drinks & Juices": ["Coca Cola", "Pepsi", "Sprite", "Maaza Mango", "Orange Juice", "Apple Juice", "Energy Drink", "Soda Water", "Tonic Water", "Mixed Fruit Juice", "Iced Tea", "Cold Coffee"],
      "Sweet Tooth": ["Dairy Milk Silk", "KitKat Wafer", "Snickers Bar", "Vanilla Ice Cream", "Chocolate Ice Cream", "Brownie Mix", "Gummy Bears", "Milk Chocolate", "Dark Chocolate", "Wafers", "Lollipops", "Fruit Jellies"],
      "Packaged Food": ["Instant Noodles", "Pasta Penne", "Tomato Ketchup", "Green Chilli Sauce", "Mixed Fruit Jam", "Honey", "Pickle", "Muesli", "Corn Flakes", "Oats", "Soya Chunks", "Mayonnaise", "Peanut Butter"],
      "Sexual Wellness": ["Ultra Thin Condoms", "Flavored Condoms", "Lubricant Gel", "Pregnancy Test Kit", "Sanitary Pads", "Menstrual Cup", "Sexual Health Supplements", "Personal Massager"],
      "Toys & Games": ["Action Figure", "Hot Wheels Car", "Building Blocks", "Puzzle Set", "Teddy Bear", "Board Game", "Remote Control Car", "Barbie Doll", "Art and Craft Kit", "Cricket Bat", "Football"],
      "Personal Care": ["Moisturizing Soap", "Anti-Dandruff Shampoo", "Face Wash", "Hand Cream", "Body Lotion", "Toothpaste", "Mouthwash", "Hair Oil", "Sunscreen", "Deodorant", "Shaving Foam"],
      "Household Essentials": ["Dishwash Liquid", "Detergent Powder", "Floor Cleaner", "Toilet Cleaner", "Glass Cleaner", "Garbage Bags", "Kitchen Tissue", "Toilet Paper", "Air Freshener", "Mosquito Repellent"],
    };

    const brands = ["Farm Fresh", "Organic India", "Amul", "Britannia", "Nestle", "PepsiCo", "Cadbury", "HUL", "ITC", "Durex", "LEGO", "Mattel", "Colgate", "P&G", "Johnson & Johnson"];
    const weights = ["100g", "250g", "500g", "1kg", "100ml", "500ml", "1L", "Pack of 1", "Pack of 6", "Unit"];

    let allProducts: any[] = [];
    const targetCount = 5000;

    console.log("🔨 Generating product data...");

    for (let i = 1; i <= targetCount; i++) {
        const categoryName = categoriesData[i % categoriesData.length].name;
        const subCategoryList = productPool[categoryName];
        const baseName = subCategoryList[Math.floor(Math.random() * subCategoryList.length)];
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const weight = weights[Math.floor(Math.random() * weights.length)];
        
        // Generate a name that feels unique but relevant
        const productName = `${brand} ${baseName} (${weight}) - ${i}`;
        
        // Dynamic prompt for Pollinations to keep images relevant
        const imagePrompt = `high%20quality%20pro%20commercial%20photography%20of%20${baseName.replace(/ /g, '%20')}%20product%20on%20pure%20white%20studio%20background%20clean%20lighting`;

        allProducts.push({
            name: productName,
            description: `High quality ${baseName} by ${brand}. Carefully processed and packed for maximum freshness and reliability. Perfect for your daily needs.`,
            category: categoryName,
            brand: brand,
            price: Math.floor(Math.random() * 950) + 20, // 20 to 970
            discount_percentage: Math.floor(Math.random() * 25), // 0 to 24%
            stock: Math.floor(Math.random() * 500) + 50,
            image_url: `https://image.pollinations.ai/prompt/${imagePrompt}?width=400&height=400&nologo=true&seed=${i}`, // seed ensures variety but consistency for same i
            rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 to 5.0
            reviews: [],
            veg_nonveg: categoryName === "Sexual Wellness" || categoryName === "Toys & Games" ? "veg" : (Math.random() > 0.9 ? "non-veg" : "veg"),
            weight: weight,
        });

        // Batch insert every 500 products to avoid memory issues
        if (allProducts.length === 500) {
            await ProductModel.insertMany(allProducts);
            console.log(`📡 Inserted ${i} / ${targetCount} products...`);
            allProducts = [];
        }
    }

    // Insert remaining
    if (allProducts.length > 0) {
        await ProductModel.insertMany(allProducts);
    }

    // Promo codes
    const promos = await PromoModel.insertMany([
      {
        code: "MEGA5000",
        description: "Special launch offer - 20% off!",
        discount_type: "percentage",
        discount_value: 20,
        max_uses: 10000,
        used_count: 0,
        applicable_categories: [],
        min_cart_value: 499,
        valid_from: new Date(),
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        is_active: true,
      },
    ]);

    console.log(`✅ MEGA-SEED COMPLETE!
  - ${categories.length} Categories Created
  - ${targetCount} Products Generated & Inserted
  - ${promos.length} Promo Codes Active`);

  } catch (error) {
    console.error("❌ Mega-Seed failed:", error);
    throw error;
  }
}
