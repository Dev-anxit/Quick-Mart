import express from "express";
import * as productController from '../controllers/productController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all products with filters
router.get("/", productController.getProducts);

// Get categories (must come before /:id to avoid matching "categories" as an ID)
router.get("/categories", productController.getCategories);

// Search products (must come before /:id to avoid matching "search" as an ID)
router.get("/search/:query", productController.searchProducts);

// Get product by ID
router.get("/:id", productController.getProduct);

// Admin: Create product
router.post("/", authMiddleware, productController.createProduct);

// Admin: Update product
router.put("/:id", authMiddleware, productController.updateProduct);

// Admin: Delete product
router.delete("/:id", authMiddleware, productController.deleteProduct);

export default router;
