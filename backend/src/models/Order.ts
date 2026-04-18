import { Schema, model, Document } from "mongoose";
import { Order, OrderItem } from '../types/index';

const orderItemSchema = new Schema<OrderItem>({
  product_id: { type: String, required: true },
  quantity: { type: Number, required: true },
  price_at_purchase: { type: Number, required: true },
});

const orderSchema = new Schema<Order & Document>({
  user_id: { type: String, required: true, index: true },
  order_number: { type: String, required: true, unique: true, index: true },
  items: [orderItemSchema],
  total_amount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  delivery_fee: { type: Number, default: 0 },
  platform_fee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["pending", "payment_pending", "confirmed", "packed", "picked_up", "on_way", "delivered", "cancelled"],
    default: "pending",
    index: true,
  },
  payment_method: { type: String, required: true },
  payment_id: { type: String },
  razorpay_order_id: { type: String },
  delivery_address: { type: Schema.Types.Mixed, required: true },
  scheduled_time: { type: Date },
  rider_id: { type: String },
  estimated_delivery_time: { type: Date },
  created_at: { type: Date, default: Date.now, index: true },
  updated_at: { type: Date, default: Date.now },
  delivered_at: { type: Date },
});

orderSchema.index({ user_id: 1, created_at: -1 });
orderSchema.index({ status: 1, created_at: -1 });
export const OrderModel = model<Order & Document>("Order", orderSchema);
