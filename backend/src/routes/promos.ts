import express from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../config/prisma';

const router = express.Router();

// Validate a promo code
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Promo code is required' });
    }

    const promo = await prisma.promo.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promo) {
      return res.status(404).json({ success: false, message: 'Invalid promo code' });
    }

    if (!promo.is_active) {
      return res.status(400).json({ success: false, message: 'Promo code is no longer active' });
    }

    if (promo.expires_at && promo.expires_at < new Date()) {
      return res.status(400).json({ success: false, message: 'Promo code has expired' });
    }

    if (promo.usage_limit && promo.times_used >= promo.usage_limit) {
      return res.status(400).json({ success: false, message: 'Promo code usage limit reached' });
    }

    return res.json({
      success: true,
      data: {
        code: promo.code,
        discount_type: 'percentage',
        discount_value: promo.discount_percentage,
        max_discount: promo.max_discount,
        min_purchase: promo.min_purchase,
      },
    });
  } catch (error) {
    console.error('Promo validation error:', error);
    res.status(500).json({ success: false, message: 'Failed to validate promo code' });
  }
});

// Get all active promos (for display purposes)
router.get('/', async (req: Request, res: Response) => {
  try {
    const promos = await prisma.promo.findMany({
      where: { is_active: true },
      select: {
        code: true,
        discount_percentage: true,
        min_purchase: true,
        expires_at: true,
      },
    });

    res.json({ success: true, data: promos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get promos' });
  }
});

export default router;
