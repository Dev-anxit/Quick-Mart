import express from "express";
import type { Request, Response, NextFunction } from "express";
import { authMiddleware } from '../middleware/auth';
import { getRedisClient } from '../config/redis';

const router = express.Router();

// Sync cart to backend
router.post("/sync", authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { items, appliedPromo } = req.body;

    // Get Redis client
    const redisClient = getRedisClient();

    if (!redisClient) {
      // If Redis not available, just return success (optional feature)
      return res.json({
        success: true,
        message: "Cart saved locally (Redis unavailable)",
      });
    }

    // Store in Redis with 24-hour TTL
    const ttl = 24 * 60 * 60; // 24 hours in seconds
    const cartKey = `cart:${req.user.uid}`;

    await redisClient.setEx(
      cartKey,
      ttl,
      JSON.stringify({
        items,
        appliedPromo,
        lastSynced: new Date(),
      })
    );

    res.json({
      success: true,
      message: "Cart synced successfully",
      cartKey,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to sync cart" });
  }
});

// Get cart from backend
router.get("/get", authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const redisClient = getRedisClient();

    if (!redisClient) {
      return res.json({
        success: true,
        data: null,
        message: "Redis unavailable",
      });
    }

    const cartKey = `cart:${req.user.uid}`;
    const cartData = await redisClient.get(cartKey);

    if (!cartData) {
      return res.json({
        success: true,
        data: null,
      });
    }

    res.json({
      success: true,
      data: JSON.parse(cartData),
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch cart" });
  }
});

// Clear cart
router.delete("/clear", authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const redisClient = getRedisClient();

    if (redisClient) {
      const cartKey = `cart:${req.user.uid}`;
      await redisClient.del(cartKey);
    }

    res.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to clear cart" });
  }
});

export default router;
