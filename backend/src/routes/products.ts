import express from "express";
import type { Request, Response, NextFunction } from "express";
import { optionalAuthMiddleware } from '../middleware/auth';
import {
  getProducts,
  getProductById,
  getCategories,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get("/", optionalAuthMiddleware, getProducts);
router.get("/categories", getCategories);
router.get("/search/:query", searchProducts);
router.get("/:id", getProductById);

// Admin routes
router.post("/", authMiddleware, adminMiddleware, createProduct);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
