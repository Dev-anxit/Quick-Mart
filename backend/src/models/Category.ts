import { Schema, model, Document } from "mongoose";
import { Category } from '../types/index';

const categorySchema = new Schema<Category & Document>({
  name: { type: String, required: true, unique: true },
  icon_url: { type: String, required: true },
  parent_category: { type: String },
  display_order: { type: Number, default: 0, index: true },
});

export const CategoryModel = model<Category & Document>("Category", categorySchema);
