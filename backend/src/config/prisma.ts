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
    await prisma.$connect();
    console.log('✅ Prisma/MongoDB connected successfully');
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

// Graceful shutdown — use process event instead of Prisma beforeExit (removed in Prisma 5)
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
