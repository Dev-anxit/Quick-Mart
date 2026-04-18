import express from "express";
import type { Request, Response, NextFunction } from "express";
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  razorpayCreateOrder,
  razorpayWebhook,
  updateOrderStatus,
  getAllOrders,
} from '../controllers/orderController';

const router = express.Router();

// User routes
router.post("/create", authMiddleware, createOrder);
router.post("/razorpay/create-order", authMiddleware, razorpayCreateOrder);
router.get("/:id", authMiddleware, getOrderById);
router.get("/user/:userId", authMiddleware, getUserOrders);

// Webhook (no auth required)
router.post("/razorpay/webhook", razorpayWebhook);

// Admin routes
router.get("/admin/all", authMiddleware, adminMiddleware, getAllOrders);
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
