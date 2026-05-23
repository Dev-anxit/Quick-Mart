import type { Request, Response } from "express";
import { OrderService } from '../services/orderService';
import { razorpayInstance } from '../services/razorpay';

export async function createOrder(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { items, totalAmount, discountAmount = 0, deliveryFee = 50, paymentMethod, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order items are required" });
    }

    const order = await OrderService.createOrder({
      userId,
      items,
      totalAmount,
      discountAmount,
      deliveryFee,
      paymentMethod,
      deliveryAddress,
    });

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create order" });
  }
}

export async function getOrders(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { page = 1 } = req.query;
    const { orders, total } = await OrderService.getUserOrders(userId, Number(page));

    res.json({
      success: true,
      orders,
      pagination: {
        page: Number(page),
        total,
        pages: Math.ceil(total / 20),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to get orders" });
  }
}

export async function getOrder(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const order = await OrderService.getOrderById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Verify ownership
    if (order.user_id !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to get order" });
  }
}

export async function createPayment(req: Request, res: Response) {
  try {
    const { orderId, amount } = req.body;
    const orderIdStr = Array.isArray(orderId) ? orderId[0] : orderId;

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: orderIdStr,
    };

    const razorpay = require('razorpay');
    const instance = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await instance.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create payment" });
  }
}

export async function verifyPayment(req: Request, res: Response) {
  try {
    const { orderId, paymentId, signature } = req.body;
    const orderIdStr = Array.isArray(orderId) ? orderId[0] : orderId;
    const paymentIdStr = Array.isArray(paymentId) ? paymentId[0] : paymentId;

    // Verify signature
    const body = orderIdStr + "|" + paymentIdStr;
    const crypto = require("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Update order with payment ID
    await OrderService.updatePaymentId(orderIdStr, paymentIdStr);

    res.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Payment verification failed" });
  }
}

export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ error: "Order ID and status are required" });
    }

    await OrderService.updateOrderStatus(orderId, status);

    // Emit socket event for real-time update
    const io = (global as any).io;
    if (io) {
      io.of("/orders")
        .to(`order_${orderId}`)
        .emit("order_status_changed", {
          orderId,
          status,
          timestamp: new Date(),
        });
    }

    res.json({
      success: true,
      message: "Order status updated",
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update order" });
  }
}
