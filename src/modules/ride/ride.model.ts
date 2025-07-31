import mongoose, { Model } from "mongoose";
import { IRide, RideStatus } from "./ride.interface";
const rideSchema = new mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pickupLocation: { type: String },
    destinationLocation: { type: String },
    status: {
      type: String,
      enum: Object.values(RideStatus),
      default: RideStatus.REQUESTED,
    },
    fare: Number,
    timestamps: {
      requestedAt: Date,
      acceptedAt: Date,
      rejectedAt: Date,
      pickedUpAt: Date,
      completedAt: Date,
      cancelledAt: Date,
    },
  },
  { timestamps: true }
);

export const Ride: Model<IRide> = mongoose.model<IRide>("Ride", rideSchema);
