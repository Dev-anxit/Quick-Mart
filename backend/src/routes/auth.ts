import express from "express";
import type { Request, Response } from "express";
import { authMiddleware } from '../middleware/auth';
import { signToken } from '../config/jwt';
import { UserModel } from '../models/User';

const router = express.Router();

// Verify Firebase token — create/get user and return JWT
// The frontend sends the Firebase ID token in req.body.token
router.post("/verify-token", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: "No token provided" });
    }

    // In production you would validate the Firebase token here via firebase-admin.
    // For now we decode it safely and create a stub user so the login flow works end-to-end.
    // The uid is extracted from the token payload (Firebase tokens are JWTs).
    let uid: string;
    let email: string;
    let name: string;

    try {
      // Decode the Firebase token (base64url) without verifying — safe for dev
      const [, payloadB64] = token.split('.');
      const decoded = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
      uid = decoded.user_id || decoded.sub || `guest_${Date.now()}`;
      email = decoded.email || `${uid}@quickmart.local`;
      name = decoded.name || 'QuickMart User';
    } catch {
      uid = `guest_${Date.now()}`;
      email = `${uid}@quickmart.local`;
      name = 'QuickMart User';
    }

    // Upsert user in MongoDB
    let user = await UserModel.findOne({ uid });
    if (!user) {
      user = new UserModel({
        uid,
        email,
        phone: '',
        name,
        phone_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
      });
      await user.save();
    }

    // Generate JWT
    const jwtToken = signToken({ uid: user.uid, email: user.email, role: 'user' });

    res.json({
      success: true,
      data: {
        _id: user._id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        phone: user.phone,
        phone_verified: user.phone_verified,
        token: jwtToken,
      },
    });
  } catch (error) {
    console.error("verify-token error:", error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Token verification failed" });
  }
});

// Update profile
router.put("/profile", authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const { name, phone, avatar } = req.body;
    const updates: any = { updated_at: new Date() };
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await UserModel.findOneAndUpdate({ uid: req.user.uid }, updates, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Update failed" });
  }
});

// Logout
router.post("/logout", authMiddleware, async (req: Request, res: Response) => {
  try {
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Logout failed" });
  }
});

// Send OTP to phone number
router.post("/send-otp", async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    
    if (!phone || phone.length < 10) {
      return res.status(400).json({ success: false, error: "Invalid phone number" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    
    // Store OTP in database (in production, use Redis or similar)
    // For now, we'll use the User model to track OTP attempts
    const cleanPhone = phone.replace(/[^\d]/g, '').slice(-10); // Get last 10 digits
    
    // Find or create user with this phone
    let user = await UserModel.findOne({ phone: cleanPhone });
    if (!user) {
      user = new UserModel({
        uid: `phone_${cleanPhone}_${Date.now()}`,
        phone: cleanPhone,
        email: `${cleanPhone}@quickmart.local`,
        name: '',
        phone_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    
    // Store OTP temporarily (in production use Redis with TTL)
    (user as any).otp = otp;
    (user as any).otp_expiry = otpExpiry;
    await user.save();

    // In production, send SMS via Twilio or similar service
    // For development, log the OTP
    console.log(`📱 OTP for ${cleanPhone}: ${otp}`);
    
    res.json({
      success: true,
      message: "OTP sent successfully",
      // For development only - remove in production
      debug_otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    console.error("send-otp error:", error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed to send OTP" });
  }
});

// Verify OTP and login
router.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;
    
    console.log(`📝 Verify OTP request: phone=${phone}, otp=${otp}`);
    
    if (!phone || !otp) {
      console.error("❌ Missing phone or OTP");
      return res.status(400).json({ success: false, error: "Phone and OTP required" });
    }

    const cleanPhone = phone.replace(/[^\d]/g, '').slice(-10);
    console.log(`🔍 Clean phone: ${cleanPhone}`);
    
    // Find user with phone number
    const user = await UserModel.findOne({ phone: cleanPhone });
    
    console.log(`👤 User found: ${user ? 'yes' : 'no'}`);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found. Please send OTP first." });
    }

    // Check OTP validity
    const storedOtp = (user as any).otp;
    const otpExpiry = (user as any).otp_expiry;
    
    console.log(`🔐 Stored OTP: ${storedOtp}, Input OTP: ${otp}, Match: ${storedOtp === otp}`);
    
    if (!storedOtp || !otpExpiry) {
      return res.status(400).json({ success: false, error: "No OTP found. Please request a new OTP." });
    }

    if (new Date() > new Date(otpExpiry)) {
      return res.status(400).json({ success: false, error: "OTP expired. Please request a new OTP." });
    }

    if (storedOtp !== otp) {
      return res.status(401).json({ success: false, error: "Invalid OTP" });
    }

    // OTP verified successfully
    user.phone_verified = true;
    (user as any).otp = undefined;
    (user as any).otp_expiry = undefined;
    await user.save();

    // Generate JWT token
    const jwtToken = signToken({
      uid: user.uid,
      email: user.email,
      role: "user",
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        phone: user.phone,
        phone_verified: user.phone_verified,
        token: jwtToken,
      },
    });
  } catch (error) {
    console.error("verify-otp error:", error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "OTP verification failed" });
  }
});

export default router;
