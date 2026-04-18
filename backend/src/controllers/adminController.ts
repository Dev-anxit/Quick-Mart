import express from "express";
import type { Request, Response, NextFunction } from "express";
import { OrderModel } from '../models/Order';
import { ProductModel } from '../models/Product';
import { UserModel } from '../models/User';

// Get dashboard metrics
export async function getDashboardMetrics(req: Request, res: Response) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Revenue calculation
    const todayRevenue = await OrderModel.aggregate([
      {
        $match: {
          created_at: { $gte: today },
          status: { $in: ["confirmed", "delivered"] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total_amount" },
        },
      },
    ]);

    const thisMonthRevenue = await OrderModel.aggregate([
      {
        $match: {
          created_at: {
            $gte: new Date(today.getFullYear(), today.getMonth(), 1),
          },
          status: { $in: ["confirmed", "delivered"] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total_amount" },
        },
      },
    ]);

    // Order counts
    const totalOrders = await OrderModel.countDocuments();
    const todayOrders = await OrderModel.countDocuments({ created_at: { $gte: today } });
    const pendingOrders = await OrderModel.countDocuments({ status: "payment_pending" });
    const confirmedOrders = await OrderModel.countDocuments({ status: "confirmed" });
    const deliveredOrders = await OrderModel.countDocuments({ status: "delivered" });

    // Product stats
    const totalProducts = await ProductModel.countDocuments();
    const lowStockProducts = await ProductModel.countDocuments({ stock: { $lt: 20 } });

    const topProducts = await ProductModel.find()
      .sort({ rating: -1 })
      .limit(5)
      .select("name rating price stock");

    res.json({
      success: true,
      data: {
        revenue: {
          today: todayRevenue[0]?.total || 0,
          thisMonth: thisMonthRevenue[0]?.total || 0,
        },
        orders: {
          total: totalOrders,
          today: todayOrders,
          pending: pendingOrders,
          confirmed: confirmedOrders,
          delivered: deliveredOrders,
        },
        products: {
          total: totalProducts,
          lowStock: lowStockProducts,
          topProducts,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch metrics" });
  }
}

// Get all orders (admin)
export async function getAllOrders(req: Request, res: Response) {
  try {
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
        .limit(limitNum)
        .lean(),
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

// Get all products (admin)
export async function getAllProducts(req: Request, res: Response) {
  try {
    const { page = "1", limit = "20", category, search } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    let query: any = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const [products, total] = await Promise.all([
      ProductModel.find(query)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ProductModel.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch products" });
  }
}

// Create product
export async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, category, brand, price, discount_percentage, stock, image_url, veg_nonveg, weight } = req.body;

    if (!name || !category || !price || image_url === undefined || veg_nonveg === undefined || !weight) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const product = new ProductModel({
      name,
      description: description || "",
      category,
      brand: brand || "",
      price,
      discount_percentage: discount_percentage || 0,
      stock: stock || 0,
      image_url,
      veg_nonveg,
      weight,
      rating: 4.5,
      reviews: [],
    });

    await product.save();

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create product" });
  }
}

// Update product
export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow modifying system fields
    delete updates._id;
    delete updates.created_at;

    const product = await ProductModel.findByIdAndUpdate(id, { ...updates, updated_at: new Date() }, { new: true });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update product" });
  }
}

// Delete product
export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const product = await ProductModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to delete product" });
  }
}

// Get users for analytics
export async function getUsers(req: Request, res: Response) {
  try {
    const { page = "1", limit = "20" } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      UserModel.find()
        .select("-__v")
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      UserModel.countDocuments(),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch users" });
  }
}

// Get low stock alerts
export async function getLowStockAlerts(req: Request, res: Response) {
  try {
    const { threshold = "20" } = req.query;

    const products = await ProductModel.find({
      stock: { $lt: parseInt(threshold as string) },
    })
      .sort({ stock: 1 })
      .select("name stock category price")
      .lean();

    res.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch alerts" });
  }
}

// Get revenue trends
export async function getRevenueTrends(req: Request, res: Response) {
  try {
    const { days = "30" } = req.query;
    const daysCount = parseInt(days as string);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysCount);

    const trends = await OrderModel.aggregate([
      {
        $match: {
          created_at: { $gte: startDate },
          status: { $in: ["confirmed", "delivered"] },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$created_at" },
          },
          revenue: { $sum: "$total_amount" },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch trends" });
  }
}
