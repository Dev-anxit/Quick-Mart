import express from "express";
import type { Request, Response } from "express";
import { authMiddleware } from '../middleware/auth';
import * as orderController from '../controllers/orderController';

const router = express.Router();

// Create order
router.post("/create", authMiddleware, orderController.createOrder);

// Get user's orders
router.get("/", authMiddleware, orderController.getOrders);

// Get specific order
router.get("/:id", authMiddleware, orderController.getOrder);

// Create payment
router.post("/payment/create", authMiddleware, orderController.createPayment);

// Verify payment
router.post("/payment/verify", authMiddleware, orderController.verifyPayment);

// Update order status (admin)
router.put("/:id/status", authMiddleware, orderController.updateOrderStatus);

export default router;
