import { Schema, model, Document } from "mongoose";
import { Promo } from '../types/index';

const promoSchema = new Schema<Promo & Document>({
  code: { type: String, required: true, unique: true, uppercase: true, index: true },
  description: { type: String },
  discount_type: { type: String, enum: ["percentage", "fixed"], required: true },
  discount_value: { type: Number, required: true },
  max_uses: { type: Number, required: true },
  used_count: { type: Number, default: 0 },
  applicable_categories: [{ type: String }],
  min_cart_value: { type: Number, default: 0 },
  valid_from: { type: Date, required: true },
  valid_until: { type: Date, required: true },
  is_active: { type: Boolean, default: true, index: true },
});

export const PromoModel = model<Promo & Document>("Promo", promoSchema);
