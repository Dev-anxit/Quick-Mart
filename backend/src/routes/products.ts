import express from "express";
import type { Request, Response } from "express";
import * as productController from '../controllers/productController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all products with filters
router.get("/", productController.getProducts);

// Get product by ID
router.get("/:id", productController.getProduct);

// Get categories
router.get("/categories", productController.getCategories);

// Admin: Create product
router.post("/", authMiddleware, productController.createProduct);

// Admin: Update product
router.put("/:id", authMiddleware, productController.updateProduct);

// Admin: Delete product
router.delete("/:id", authMiddleware, productController.deleteProduct);

export default router;
