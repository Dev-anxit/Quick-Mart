import express from "express";
import type { Request, Response, NextFunction } from "express";
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router = express.Router();

router.post("/verify-token", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    // TODO: Verify the token via firebase-admin in production
    // For now, we return a fully formed valid response so the frontend flow succeeds
    res.json({
      success: true,
      data: {
        _id: "mock_user_123",
        email: "guest@quickmart.com",
        name: "QuickMart User",
        role: "user",
        phone: "+910000000000",
        token: token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Unknown error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    res.json({ message: "TODO: Implement login" });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
});

router.post("/logout", authMiddleware, async (req: Request, res: Response) => {
  try {
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
});

export default router;
