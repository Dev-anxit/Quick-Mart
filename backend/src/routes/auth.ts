import express from "express";
import type { Request, Response } from "express";
import { authMiddleware } from '../middleware/auth';
import { signToken } from '../config/jwt';
import * as authController from '../controllers/authController';

const router = express.Router();

// Verify Firebase token
router.post("/verify-token", authController.verifyToken);

// Send OTP
router.post("/send-otp", authController.sendOTP);

// Verify OTP and login
router.post("/verify-otp", authController.verifyOTP);

// Get user profile
router.get("/profile", authMiddleware, authController.getProfile);

// Update user profile
router.put("/profile", authMiddleware, authController.updateProfile);

export default router;
