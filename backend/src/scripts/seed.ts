import "dotenv/config";
import mongoose from "mongoose";
import { seedDatabase } from '../utils/seedDatabase';

async function main() {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";
    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✓ Connected");

    await seedDatabase();

    await mongoose.connection.close();
    console.log("✓ Closed connection");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
