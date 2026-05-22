import { Schema, model, Document } from "mongoose";
import { User } from '../types/index';

const userSchema = new Schema<User & Document>({
  uid: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, default: '' },
  name: { type: String, default: '' },
  avatar: { type: String },
  phone_verified: { type: Boolean, default: false },
  otp: { type: String, default: null },
  otp_expiry: { type: Date, default: null },
  created_at: { type: Date, default: Date.now, index: true },
  updated_at: { type: Date, default: Date.now },
});

userSchema.index({ created_at: -1 });
export const UserModel = model<User & Document>("User", userSchema);
