import express from 'express';
import type { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { ProductService } from '../services/productService';

const router = express.Router();

// Store carts in memory (in production, use session storage or database)
const carts = new Map<string, Array<{ productId: string; quantity: number }>>();

// Add item to cart
router.post('/add', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid product or quantity' });
    }

    // Verify product exists
    const product = await ProductService.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get or create cart
    const cart = carts.get(userId) || [];

    // Check if product already in cart
    const existingItem = cart.find((item) => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }

    carts.set(userId, cart);

    res.json({
      success: true,
      message: 'Item added to cart',
      cartCount: cart.length,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to add item' });
  }
});

// Get cart
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const cart = carts.get(userId) || [];

    // Fetch product details for all items in cart
    const cartItems = await Promise.all(
      cart.map(async (item) => {
        const product = await ProductService.getProductById(item.productId);
        return {
          ...item,
          product,
          total: (product?.price || 0) * item.quantity,
        };
      })
    );

    const cartTotal = cartItems.reduce((sum, item) => sum + (item.total || 0), 0);

    res.json({
      success: true,
      cart: cartItems,
      total: cartTotal,
      itemCount: cart.length,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to get cart' });
  }
});

// Update cart item quantity
router.put('/update/:productId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const cart = carts.get(userId) || [];
    const item = cart.find((i) => i.productId === productId);

    if (!item) {
      return res.status(404).json({ error: 'Item not in cart' });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      const index = cart.indexOf(item);
      cart.splice(index, 1);
    } else {
      item.quantity = quantity;
    }

    carts.set(userId, cart);

    res.json({
      success: true,
      message: 'Cart updated',
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to update cart' });
  }
});

// Remove item from cart
router.delete('/remove/:productId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { productId } = req.params;

    const cart = carts.get(userId) || [];
    const filteredCart = cart.filter((item) => item.productId !== productId);

    if (filteredCart.length === cart.length) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    carts.set(userId, filteredCart);

    res.json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to remove item' });
  }
});

// Clear cart
router.delete('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    carts.delete(userId);

    res.json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to clear cart' });
  }
});

export default router;
