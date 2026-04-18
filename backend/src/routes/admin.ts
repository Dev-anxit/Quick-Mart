import express from "express";
import type { Request, Response, NextFunction } from "express";
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
  getDashboardMetrics,
  getAllOrders,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getUsers,
  getLowStockAlerts,
  getRevenueTrends,
} from '../controllers/adminController';

const router = express.Router();

// Apply auth and admin middleware to all routes
router.use(authMiddleware, adminMiddleware);

// Dashboard
router.get("/dashboard", getDashboardMetrics);
router.get("/revenue-trends", getRevenueTrends);

// Orders
router.get("/orders", getAllOrders);

// Products
router.get("/products", getAllProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/low-stock", getLowStockAlerts);

// Users
router.get("/users", getUsers);

export default router;
