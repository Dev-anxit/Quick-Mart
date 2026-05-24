import express from "express";
import type { Request, Response, NextFunction } from "express";
import { UserService } from '../services/userService';
import { signToken } from '../config/jwt';

// Verify Firebase token and create/get user
export async function verifyToken(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Check if user exists, if not create
    let user = await UserService.findByUid(req.user.uid);

    if (!user) {
      user = await UserService.create({
        uid: req.user.uid,
        email: req.user.email || "",
        phone: "",
        name: "",
        phone_verified: false,
      });
    }

    // Generate JWT token
    const jwtToken = signToken({
      uid: user.uid,
      email: user.email,
      role: req.user.role || "user",
    });

    res.json({
      success: true,
      token: jwtToken,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Verification failed" });
  }
}

// Send OTP
export async function sendOTP(req: Request, res: Response) {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    // Find or create user by phone
    let user = await UserService.findByEmail(`${phone}@quickmart.local`);

    if (!user) {
      user = await UserService.create({
        uid: `phone_${phone}`,
        email: `${phone}@quickmart.local`,
        phone: phone || '',
        name: `User ${phone}`,
        phone_verified: false,
      });
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP (expires in 10 minutes)
    if (user.id) {
      await UserService.updateOTP(user.id, otp);
    }

    // In production, send via SMS service
    console.log(`[OTP for ${phone}]: ${otp}`);

    res.json({
      success: true,
      message: "OTP sent successfully",
      // For testing: send OTP in response
      ...(process.env.NODE_ENV === 'development' && { otp }),
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to send OTP" });
  }
}

// Verify OTP and login
export async function verifyOTP(req: Request, res: Response) {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ error: "Phone and OTP are required" });
    }

    // Find user by phone
    const user = await UserService.findByEmail(`${phone}@quickmart.local`);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify OTP
    const userId = user.id || '';
    const isValid = await UserService.verifyOTP(userId, otp);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    // Generate JWT token — embed dbId so we don't need a DB lookup per request
    const token = signToken({
      uid: user.uid,
      email: user.email,
      role: "user",
      dbId: user.id,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "OTP verification failed" });
  }
}

// Get user profile
export async function getProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await UserService.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        phone: user.phone,
        phone_verified: user.phone_verified,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to get profile" });
  }
}

// Update user profile
export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, phone, avatar } = req.body;

    const user = await UserService.updateProfile(userId, {
      name,
      phone,
      avatar,
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update profile" });
  }
}
