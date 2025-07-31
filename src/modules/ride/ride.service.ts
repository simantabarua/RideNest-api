import { IRideRequest } from "./ride.interface";
import { Ride } from "./ride.model";

export const createRide = async (data: IRideRequest, riderId: string) => {
  return Ride.create({
    ...data,
    rider: riderId,
    status: "requested",
    timestamps: { requestedAt: new Date() },
  });
};

export const cancelRide = async (rideId: string, userId: string) => {
  const ride = await Ride.findOne({ _id: rideId, rider: userId });

  if (!ride) throw new Error("Ride not found");
  if (ride.status !== "requested")
    throw new Error("Cannot cancel after ride is accepted");

  ride.status = "cancelled";
  ride.timestamps.cancelledAt = new Date();
  await ride.save();
  return ride;
};

export const getRiderRides = async (riderId: string) => {
  return Ride.find({ rider: riderId }).sort({ createdAt: -1 });
};

export const RideService = {
  createRide,
  cancelRide,
  getRiderRides,
};
