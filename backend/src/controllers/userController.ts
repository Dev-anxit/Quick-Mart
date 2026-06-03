import type { Request, Response } from "express";
import { prisma } from '../config/prisma';

function normalizeAddress(dbAddr: any) {
  return {
    _id: dbAddr.id,
    user_id: dbAddr.user_id,
    label: dbAddr.type,
    street: dbAddr.street,
    city: dbAddr.city,
    pincode: dbAddr.postal_code,
    lat: dbAddr.latitude,
    lng: dbAddr.longitude,
    is_default: dbAddr.is_default,
    saved_at: dbAddr.created_at.toISOString(),
  };
}

export async function getSavedAddresses(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const addresses = await prisma.address.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    res.json({
      success: true,
      data: addresses.map(normalizeAddress),
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to get addresses" });
  }
}

export async function addAddress(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { label, street, city, pincode, lat = 0.0, lng = 0.0, is_default = false } = req.body;

    if (is_default) {
      await prisma.address.updateMany({
        where: { user_id: userId },
        data: { is_default: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        user_id: userId,
        type: label || 'home',
        street: street || '',
        city: city || '',
        state: 'Delhi',
        postal_code: pincode || '',
        latitude: Number(lat),
        longitude: Number(lng),
        is_default,
      },
    });

    res.json({
      success: true,
      data: normalizeAddress(newAddress),
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to add address" });
  }
}

export async function updateAddress(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { label, street, city, pincode, lat, lng, is_default } = req.body;

    // Check ownership
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.user_id !== userId) {
      return res.status(403).json({ error: "Forbidden or address not found" });
    }

    if (is_default) {
      await prisma.address.updateMany({
        where: { user_id: userId },
        data: { is_default: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        ...(label && { type: label }),
        ...(street !== undefined && { street }),
        ...(city !== undefined && { city }),
        ...(pincode !== undefined && { postal_code: pincode }),
        ...(lat !== undefined && { latitude: Number(lat) }),
        ...(lng !== undefined && { longitude: Number(lng) }),
        ...(is_default !== undefined && { is_default }),
      },
    });

    res.json({
      success: true,
      data: normalizeAddress(updated),
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update address" });
  }
}

export async function deleteAddress(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check ownership
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.user_id !== userId) {
      return res.status(403).json({ error: "Forbidden or address not found" });
    }

    await prisma.address.delete({ where: { id } });

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to delete address" });
  }
}
