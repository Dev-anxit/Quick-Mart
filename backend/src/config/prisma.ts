import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env early so DATABASE_URL is available when Prisma initializes
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function connectDatabase() {
  try {
    // Use a lightweight query to test connection instead of $connect()
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Prisma/PostgreSQL connected successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    throw error;
  }
}

export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting database:', error);
  }
}
