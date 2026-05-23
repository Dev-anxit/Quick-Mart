import type { Request, Response } from "express";
import { OrderService } from '../services/orderService';
import { ProductService } from '../services/productService';
import { UserService } from '../services/userService';
import { prisma } from '../config/prisma';

// Get all orders
export async function getAllOrders(req: Request, res: Response) {
  try {
    const { page = 1, status } = req.query;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (Number(page) - 1) * 20,
        take: 20,
        include: {
          user: true,
          items: {
            include: { product: true },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

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

// Get dashboard stats
export async function getDashboardStats(req: Request, res: Response) {
  try {
    const [totalUsers, totalOrders, totalRevenue, topProducts] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          total_amount: true,
        },
      }),
      prisma.product.findMany({
        orderBy: { rating: 'desc' },
        take: 5,
      }),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue._sum.total_amount || 0,
        topProducts,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to get stats" });
  }
}

// Get users
export async function getUsers(req: Request, res: Response) {
  try {
    const { page = 1 } = req.query;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        orderBy: { created_at: 'desc' },
        skip: (Number(page) - 1) * 20,
        take: 20,
      }),
      prisma.user.count(),
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        page: Number(page),
        total,
        pages: Math.ceil(total / 20),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to get users" });
  }
}

// Get products
export async function getAdminProducts(req: Request, res: Response) {
  try {
    const { page = 1 } = req.query;

    const { products, total } = await ProductService.getProducts({
      page: Number(page),
      limit: 20,
    });

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        total,
        pages: Math.ceil(total / 20),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to get products" });
  }
}

// Update order status
export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { orderId, status } = req.body;

    await OrderService.updateOrderStatus(orderId, status);

    res.json({
      success: true,
      message: "Order status updated",
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update order" });
  }
}

// Assign rider
export async function assignRider(req: Request, res: Response) {
  try {
    const { orderId, riderId } = req.body;

    await OrderService.assignRider(orderId, riderId);

    res.json({
      success: true,
      message: "Rider assigned",
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to assign rider" });
  }
}
