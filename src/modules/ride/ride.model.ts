import mongoose, { Model, Schema } from "mongoose";
import { IRide, RideStatus } from "./ride.interface";
import { Role } from "../user/user.interface";

const rideSchema = new mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    destinationLocation: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(RideStatus),
      default: RideStatus.REQUESTED,
    },
    fare: {
      type: Number,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    timestamps: {
      requestedAt: Date,
      acceptedAt: Date,
      rejectedAt: Date,
      pickedUpAt: Date,
      completedAt: Date,
      cancelledAt: Date,
      inTransitAt: Date,
    },
    cancellation: {
      reason: { type: String },
      cancelledBy: {
        type: String,
        enum: Object.values(Role),
      },
      cancelledAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Ride: Model<IRide> = mongoose.model<IRide>("Ride", rideSchema);
