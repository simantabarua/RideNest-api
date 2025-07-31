import { Schema } from "mongoose";
import { IDriver } from "./driver.interface";

export const DriverSchema = new Schema<IDriver>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  isApproved: { type: Boolean, default: false },
  isOnline: { type: Boolean, default: false },
  earnings: { type: Number, default: 0 },
  currentRide: { type: Schema.Types.ObjectId, ref: "Ride", default: null },
});
