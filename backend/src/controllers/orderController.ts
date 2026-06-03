import type { Request, Response } from "express";
import { OrderService } from '../services/orderService';
import crypto from 'crypto';

export async function createOrder(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { items, delivery_address, payment_method, promo_code } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order items are required" });
    }

    // Calculate amounts
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price_at_purchase || item.price) * item.quantity, 0);
    const deliveryFee = subtotal > 299 ? 0 : 30;
    const platformFee = Math.round(subtotal * 0.03);
    const totalAmount = subtotal + deliveryFee + platformFee;

    const order = await OrderService.createOrder({
      userId,
      items: items.map((item: any) => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: item.price_at_purchase || item.price || 0,
      })),
      totalAmount,
      discountAmount: 0,
      deliveryFee,
      paymentMethod: payment_method || 'razorpay',
      deliveryAddress: delivery_address || '',
    });

    res.json({
      success: true,
      data: {
        order_id: order.id,
        order_number: order.order_number,
        amount: totalAmount,
        items: order.items,
        delivery_fee: deliveryFee,
        platform_fee: platformFee,
        tax: 0,
      },
    });
  } catch (error) {
    console.error('createOrder error:', error);
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

    const normalizedOrders = orders.map((o) => ({
      ...o,
      _id: o.id,
    }));

    res.json({
      success: true,
      data: normalizedOrders,
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

    const normalizedOrder = {
      ...order,
      _id: order.id,
    };

    res.json({
      success: true,
      data: normalizedOrder,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to get order" });
  }
}

export async function createPayment(req: Request, res: Response) {
  try {
    const { order_id, orderId, amount } = req.body;
    const finalOrderId = order_id || orderId;

    if (!finalOrderId || !amount) {
      return res.status(400).json({ error: "Order ID and amount are required" });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId === 'test-key') {
      // Return a mock response for development
      const mockOrderId = `order_mock_${Date.now()}`;
      return res.json({
        success: true,
        data: {
          razorpay_order_id: mockOrderId,
          amount: Math.round(amount * 100),
          currency: 'INR',
          receipt: finalOrderId,
        },
      });
    }

    const Razorpay = require('razorpay');
    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: finalOrderId,
    };

    const razorpayOrder = await instance.orders.create(options);

    res.json({
      success: true,
      data: {
        razorpay_order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
        key: keyId,
      },
    });
  } catch (error) {
    console.error('createPayment error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create payment" });
  }
}

export async function verifyPayment(req: Request, res: Response) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If using mock credentials, accept payment
    if (!keySecret || keySecret === 'test-secret') {
      if (orderId) {
        await OrderService.updatePaymentId(orderId, razorpay_payment_id || 'mock_payment');
      }
      return res.json({
        success: true,
        message: "Payment verified successfully",
      });
    }

    // Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Update order with payment ID
    if (orderId) {
      await OrderService.updatePaymentId(orderId, razorpay_payment_id);
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error('verifyPayment error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Payment verification failed" });
  }
}

export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ error: "Order ID and status are required" });
    }

    await OrderService.updateOrderStatus(id, status);

    // Emit socket event for real-time update
    const io = (global as any).io;
    if (io) {
      io.of("/orders")
        .to(`order_${id}`)
        .emit("order_status_changed", {
          orderId: id,
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
