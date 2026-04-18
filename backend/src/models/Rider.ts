import { Schema, model, Document } from "mongoose";
import { Rider } from '../types/index';

const riderSchema = new Schema<Rider & Document>({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  vehicle_type: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  current_location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  is_available: { type: Boolean, default: true, index: true },
  daily_earnings: { type: Number, default: 0 },
});

riderSchema.index({ "current_location.lat": 1, "current_location.lng": 1 });
export const RiderModel = model<Rider & Document>("Rider", riderSchema);
