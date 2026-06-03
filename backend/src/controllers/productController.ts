import type { Request, Response } from "express";
import { ProductService } from '../services/productService';
import { prisma } from '../config/prisma';

export async function getProducts(req: Request, res: Response) {
  try {
    const { category, page = 1, limit = 20, sort = 'newest' } = req.query;

    const categoryParam = Array.isArray(category) ? category[0] : category;
    const pageNum = Array.isArray(page) ? Number(page[0]) : Number(page);
    const limitNum = Array.isArray(limit) ? Number(limit[0]) : Number(limit);
    const sortParam = Array.isArray(sort) ? sort[0] : sort;

    const { products, total } = await ProductService.getProducts({
      category: categoryParam as string | undefined,
      page: pageNum,
      limit: limitNum,
      sort: sortParam as any,
    });

    res.json({
      success: true,
      products,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to get products" });
  }
}

export async function searchProducts(req: Request, res: Response) {
  try {
    const rawQuery = req.params.query;
    const query = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery) || "";
    const { limit = 20 } = req.query;
    const limitNum = Array.isArray(limit) ? Number(limit[0]) : Number(limit);

    const products = await ProductService.searchProducts(query, limitNum);

    res.json({
      success: true,
      data: products,
      products,
      count: products.length,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to search products" });
  }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const product = await ProductService.getProductById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to get product" });
  }
}

export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await ProductService.getCategories();

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to get categories" });
  }
}

// Admin: Create product
export async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, price, discount_percentage, stock, category_id, image_urls } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const product = await ProductService.createProduct({
      name,
      description,
      price,
      discount_percentage,
      stock,
      category_id,
      image_urls,
    });

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create product" });
  }
}

// Admin: Update product
export async function updateProduct(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { name, description, price, discount_percentage, stock, is_active } = req.body;

    const product = await ProductService.updateProduct(id, {
      name,
      description,
      price,
      discount_percentage,
      stock,
      is_active,
    });

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update product" });
  }
}

// Admin: Delete product
export async function deleteProduct(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    await ProductService.deleteProduct(id);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to delete product" });
  }
}
