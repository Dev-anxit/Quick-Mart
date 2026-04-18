import express from "express";
import type { Request, Response, NextFunction } from "express";
import { ProductModel } from '../models/Product';
import { CategoryModel } from '../models/Category';

// Get all products with filters, search, and pagination
export async function getProducts(req: Request, res: Response) {
  try {
    const { category, price_min, price_max, search, page = "1", limit = "20", sort = "relevance" } = req.query;

    let query: any = {};

    // Apply filters
    if (category) query.category = category;

    if (price_min || price_max) {
      query.price = {};
      if (price_min) query.price.$gte = parseInt(price_min as string);
      if (price_max) query.price.$lte = parseInt(price_max as string);
    }

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sortObj: any = {};
    switch (sort) {
      case "price_asc":
        sortObj = { price: 1 };
        break;
      case "price_desc":
        sortObj = { price: -1 };
        break;
      case "discount":
        sortObj = { discount_percentage: -1 };
        break;
      case "rating":
        sortObj = { rating: -1 };
        break;
      default:
        sortObj = { created_at: -1 };
    }

    const [products, total] = await Promise.all([ProductModel.find(query).sort(sortObj).skip(skip).limit(limitNum), ProductModel.countDocuments(query)]);

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

// Get single product by ID
export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch product" });
  }
}

// Get all categories
export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await CategoryModel.find().sort({ display_order: 1 });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch categories" });
  }
}

// Search products
export async function searchProducts(req: Request, res: Response) {
  try {
    const { query } = req.params;

    if (!query || query.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const products = await ProductModel.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10);

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Search failed" });
  }
}

// For admin: Create product
export async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, category, brand, price, discount_percentage, stock, image_url, veg_nonveg, weight } = req.body;

    const product = new ProductModel({
      name,
      description,
      category,
      brand,
      price,
      discount_percentage,
      stock,
      image_url,
      veg_nonveg,
      weight,
      rating: 4.5,
      reviews: [],
    });

    await product.save();

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create product" });
  }
}

// For admin: Update product
export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await ProductModel.findByIdAndUpdate(id, updates, { new: true });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update product" });
  }
}

// For admin: Delete product
export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const product = await ProductModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to delete product" });
  }
}
