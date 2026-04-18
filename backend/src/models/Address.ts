import { Schema, model, Document } from "mongoose";
import { Address } from '../types/index';

const addressSchema = new Schema<Address & Document>({
  user_id: { type: String, required: true, index: true },
  label: { type: String, enum: ["home", "office", "other"], required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  is_default: { type: Boolean, default: false },
  saved_at: { type: Date, default: Date.now },
});

addressSchema.index({ lat: 1, lng: 1 });
export const AddressModel = model<Address & Document>("Address", addressSchema);
