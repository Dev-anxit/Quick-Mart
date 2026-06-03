import express from "express";
import { authMiddleware } from '../middleware/auth';
import * as orderController from '../controllers/orderController';

const router = express.Router();

// Create order
router.post("/create", authMiddleware, orderController.createOrder);

// Get user's orders
router.get("/", authMiddleware, orderController.getOrders);

// Create Razorpay payment order (frontend calls /orders/razorpay/create-order)
router.post("/razorpay/create-order", authMiddleware, orderController.createPayment);

// Verify Razorpay payment (frontend calls /orders/razorpay/webhook)
router.post("/razorpay/webhook", authMiddleware, orderController.verifyPayment);

// Also support legacy paths
router.post("/payment/create", authMiddleware, orderController.createPayment);
router.post("/payment/verify", authMiddleware, orderController.verifyPayment);

// Get specific order (must be after specific routes)
router.get("/:id", authMiddleware, orderController.getOrder);

// Update order status (admin)
router.put("/:id/status", authMiddleware, orderController.updateOrderStatus);

export default router;
