import { Types } from "mongoose";

export enum RideStatus {
  REQUESTED = "requested",
  ACCEPTED = "accepted",
  PICKED_UP = "picked_up",
  IN_TRANSIT = "in_transit",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REJECTED = "rejected",
}
export interface IRideRequest {
  pickupLocation: string;
  destinationLocation: string;
  estimatedDistance: string;
  paymentMethod: string;
}
export interface IPayment {
  paymentStatus: "pending" | "complete" | "failed";
  paymentMethod: "cash" | "card";
}

export interface IRide extends IRideRequest {
  rider: Types.ObjectId;
  driver?: Types.ObjectId;
  status: RideStatus;
  fare?: number;
  payment?: Types.ObjectId;
  timestamps: {
    requestedAt: Date;
    acceptedAt?: Date;
    pickedUpAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    rejectedAt?: Date;
    inTransitAt?: Date;
  };
}
