import { Schema, model, Document } from "mongoose";
import { Product } from '../types/index';

const reviewSchema = new Schema({
  user_id: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String },
  created_at: { type: Date, default: Date.now },
});

const productSchema = new Schema<Product & Document>({
  name: { type: String, required: true, index: true },
  description: { type: String },
  category: { type: String, required: true, index: true },
  brand: { type: String },
  price: { type: Number, required: true, index: true },
  discount_percentage: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  image_url: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  reviews: [reviewSchema],
  nutritional_info: { type: Schema.Types.Mixed },
  veg_nonveg: { type: String, enum: ["veg", "non-veg"], required: true },
  weight: { type: String, required: true },
  created_at: { type: Date, default: Date.now, index: true },
  updated_at: { type: Date, default: Date.now },
});

productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, stock: 1 });
export const ProductModel = model<Product & Document>("Product", productSchema);
