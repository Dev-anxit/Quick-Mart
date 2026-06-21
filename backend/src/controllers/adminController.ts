import type { Request, Response } from "express";
import { OrderService } from '../services/orderService';
import { ProductService } from '../services/productService';
import { UserService } from '../services/userService';
import { prisma } from '../config/prisma';
import { isCloudinaryConfigured, uploadToCloudinary } from '../services/cloudinary';

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

    const normalizedOrders = orders.map((o) => ({
      ...o,
      _id: o.id,
    }));

    res.json({
      success: true,
      orders: normalizedOrders,
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

    const activeProducts = await prisma.product.count({ where: { is_active: true } });
    const lowStock = await prisma.product.count({ where: { stock: { lte: 5 } } });

    res.json({
      success: true,
      data: {
        total_orders: totalOrders,
        total_revenue: totalRevenue._sum.total_amount || 0,
        active_products: activeProducts,
        low_stock: lowStock,
        total_users: totalUsers,
      },
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
    const orderId = req.params.orderId || req.body.orderId;
    const { status } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

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
    const orderId = req.params.orderId || req.body.orderId;
    const { riderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    await OrderService.assignRider(orderId, riderId);

    res.json({
      success: true,
      message: "Rider assigned",
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to assign rider" });
  }
}

// Handle local image upload with Cloudinary support
export async function handleLocalUpload(req: Request, res: Response) {
  try {
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    if (isCloudinaryConfigured()) {
      try {
        const cloudinaryUrl = await uploadToCloudinary(file.path);
        return res.json({
          success: true,
          url: cloudinaryUrl,
          filename: file.filename,
        });
      } catch (cloudinaryError) {
        console.warn("⚠️ Cloudinary upload failed, falling back to local static serving:", cloudinaryError);
      }
    }

    const host = req.get("host");
    const protocol = req.protocol;
    const imageUrl = `${protocol}://${host}/uploads/${file.filename}`;

    res.json({
      success: true,
      url: imageUrl,
      filename: file.filename,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Image upload failed" });
  }
}

// Create new category
export async function createCategory(req: Request, res: Response) {
  try {
    const { name, description, image_url } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description: description || "",
        image_url: image_url || "",
        is_active: true,
      },
    });

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create category" });
  }
}

// Get all promos (admin)
export async function getAdminPromos(req: Request, res: Response) {
  try {
    const promos = await prisma.promo.findMany({
      orderBy: { created_at: 'desc' },
    });

    const normalizedPromos = promos.map(p => ({
      ...p,
      _id: p.id,
    }));

    res.json({
      success: true,
      data: normalizedPromos,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to get promos" });
  }
}

// Create new promo (admin)
export async function createPromo(req: Request, res: Response) {
  try {
    const { code, discount_percentage, max_discount, min_purchase, usage_limit, expires_at } = req.body;

    if (!code || discount_percentage === undefined) {
      return res.status(400).json({ error: "Code and discount percentage are required" });
    }

    const promo = await prisma.promo.create({
      data: {
        code: code.toUpperCase(),
        discount_percentage: Number(discount_percentage),
        max_discount: max_discount !== undefined ? Number(max_discount) : null,
        min_purchase: min_purchase !== undefined ? Number(min_purchase) : null,
        usage_limit: usage_limit !== undefined ? Number(usage_limit) : null,
        expires_at: expires_at ? new Date(expires_at) : null,
        is_active: true,
      },
    });

    res.json({
      success: true,
      data: {
        ...promo,
        _id: promo.id,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create promo" });
  }
}

// Delete promo (admin)
export async function deletePromo(req: Request, res: Response) {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id) {
      return res.status(400).json({ error: "Promo ID is required" });
    }

    await prisma.promo.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Promo code deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to delete promo" });
  }
}
