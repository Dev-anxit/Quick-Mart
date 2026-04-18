import express from "express";
import type { Request, Response, NextFunction } from "express";
import { OrderModel } from '../models/Order';
import { PromoModel } from '../models/Promo';
import { UserModel } from '../models/User';

// Generate unique order number
function generateOrderNumber(): string {
  const date = new Date();
  const timestamp = date.getTime().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Create order (payment_pending status)
export async function createOrder(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { items, delivery_address, scheduled_time, payment_method, promo_code } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate totals
    let subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    let discount = 0;
    if (promo_code) {
      const promo = await PromoModel.findOne({ code: promo_code.toUpperCase(), is_active: true });
      if (promo && promo.valid_until > new Date() && promo.used_count < promo.max_uses && subtotal >= promo.min_cart_value) {
        discount = promo.discount_type === "percentage" ? (subtotal * promo.discount_value) / 100 : promo.discount_value;
      }
    }

    const delivery_fee = subtotal > 500 ? 0 : 50;
    const platform_fee = Math.ceil(subtotal * 0.05);
    const tax = Math.ceil((subtotal - discount + delivery_fee) * 0.05);

    const total_amount = subtotal - discount + delivery_fee + platform_fee + tax;

    // Create order
    const order = new OrderModel({
      user_id: req.user.uid,
      order_number: generateOrderNumber(),
      items,
      total_amount,
      discount,
      delivery_fee,
      platform_fee,
      tax,
      status: "payment_pending",
      payment_method,
      delivery_address,
      scheduled_time,
    });

    await order.save();

    res.status(201).json({
      success: true,
      data: {
        order_id: order._id,
        order_number: order.order_number,
        total_amount: order.total_amount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create order" });
  }
}

// Get order by ID
export async function getOrderById(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { id } = req.params;
    const order = await OrderModel.findById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check authorization - user can only see their own orders
    if (order.user_id !== req.user.uid && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch order" });
  }
}

// Get user's order history
export async function getUserOrders(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { page = "1", limit = "10" } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      OrderModel.find({ user_id: req.user.uid })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limitNum),
      OrderModel.countDocuments({ user_id: req.user.uid }),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch orders" });
  }
}

// Create Razorpay order
export async function razorpayCreateOrder(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { order_id, amount } = req.body;

    // Import Razorpay service
    const { createRazorpayOrder } = await import("../services/razorpay.js");

    const razorpayOrder = await createRazorpayOrder(amount, order_id, req.user.uid);

    // Update order with razorpay_order_id
    await OrderModel.findByIdAndUpdate(order_id, {
      razorpay_order_id: razorpayOrder.razorpay_order_id,
    });

    res.json({
      success: true,
      ...razorpayOrder,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create Razorpay order" });
  }
}

// Razorpay webhook handler
export async function razorpayWebhook(req: Request, res: Response) {
  try {
    const { event, payload } = req.body;

    // Verify webhook signature
    const { verifyRazorpaySignature } = await import("../services/razorpay.js");

    const paymentEntity = payload?.payment?.entity;
    if (!paymentEntity) {
      return res.status(400).json({ error: "Invalid webhook payload" });
    }

    // Verify signature: orderId|paymentId|signature
    const isValid = verifyRazorpaySignature(
      paymentEntity.order_id,
      paymentEntity.id,
      req.headers["x-razorpay-signature"] as string
    );

    if (!isValid) {
      console.warn("Invalid Razorpay webhook signature");
      return res.status(403).json({ error: "Invalid signature" });
    }

    if (event === "payment.authorized" || event === "payment.captured") {
      const order = await OrderModel.findOneAndUpdate(
        { razorpay_order_id: paymentEntity.order_id },
        {
          status: "confirmed",
          payment_id: paymentEntity.id,
          updated_at: new Date(),
        },
        { new: true }
      );

      if (order) {
        // Emit Socket.io event to notify customer
        const io = (global as any).io;
        if (io) {
          io.of("/orders")
            .to(`order_${order._id}`)
            .emit("order_confirmed", {
              order_id: order._id,
              status: "confirmed",
              message: "Payment successful! Your order is confirmed.",
            });
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Webhook failed" });
  }
}

// Admin: Update order status
export async function updateOrderStatus(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { id } = req.params;
    const { status, rider_id, estimated_delivery_time } = req.body;

    const validStatuses = ["confirmed", "packed", "picked_up", "on_way", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updateData: any = {
      status,
      updated_at: new Date(),
    };

    if (rider_id) updateData.rider_id = rider_id;
    if (estimated_delivery_time) updateData.estimated_delivery_time = new Date(estimated_delivery_time);
    if (status === "delivered") updateData.delivered_at = new Date();

    const order = await OrderModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Emit Socket.io event to notify customer
    const io = (global as any).io;
    if (io) {
      io.of("/orders")
        .to(`order_${id}`)
        .emit("order_status_updated", {
          order_id: order._id,
          status: order.status,
          rider_id: order.rider_id,
          estimated_delivery_time: order.estimated_delivery_time,
        });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update order" });
  }
}

// Admin: Get all orders
export async function getAllOrders(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { page = "1", limit = "20", status } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    let query: any = {};
    if (status) query.status = status;

    const [orders, total] = await Promise.all([
      OrderModel.find(query)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limitNum),
      OrderModel.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch orders" });
  }
}
