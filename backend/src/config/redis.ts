import { createClient, RedisClientType } from "redis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

let redisClient: RedisClientType | null = null;

export async function initRedis() {
  if (!redisClient) {
    redisClient = createClient({
      url: REDIS_URL,
    });

    try {
      await redisClient.connect();
      console.log("✓ Redis connected");
    } catch (error) {
      console.warn("⚠ Redis connection failed (optional):", error);
    }
  }

  return redisClient;
}

export function getRedisClient() {
  return redisClient;
}

export async function closeRedis() {
  if (redisClient) {
    try {
      await redisClient.quit();
    } catch (error) {
      console.warn("Error closing Redis:", error);
    }
  }
}
