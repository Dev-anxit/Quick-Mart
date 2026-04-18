import express from "express";
import type { Request, Response, NextFunction } from "express";
import { UserModel } from '../models/User';
import { signToken } from '../config/jwt';

// Verify Firebase token and create/get user
export async function verifyToken(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Check if user exists, if not create
    let user = await UserModel.findOne({ uid: req.user.uid });

    if (!user) {
      user = new UserModel({
        uid: req.user.uid,
        email: req.user.email || "",
        phone: "",
        name: "",
        phone_verified: false,
      });
      await user.save();
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

// Login (placeholder - real Firebase integration will be in frontend)
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // TODO: Validate with Firebase
    res.json({ message: "Use Firebase SDK for authentication" });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Login failed" });
  }
}

// Logout
export async function logout(req: Request, res: Response) {
  try {
    // Invalidate token on frontend side
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Logout failed" });
  }
}
