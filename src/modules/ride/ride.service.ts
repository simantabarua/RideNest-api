import { Types } from "mongoose";
import { IRideRequest, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";

const createRide = async (data: IRideRequest, riderId: string) => {
  return Ride.create({
    ...data,
    rider: riderId,
    status: RideStatus.REQUESTED,
    timestamps: { requestedAt: new Date() },
  });
};

const updateRideStatus = async (
  rideId: string,
  userId: string,
  status: RideStatus
) => {
  const ride = await Ride.findById(rideId);
  if (!ride) throw new Error("Ride not found");

  switch (status) {
    case RideStatus.CANCELLED: {
      if (ride.rider.toString() !== userId) {
        throw new Error("Unauthorized: Only the rider can cancel this ride");
      }
      if (ride.status !== RideStatus.REQUESTED) {
        throw new Error("Cannot cancel ride after it is accepted or processed");
      }
      ride.status = RideStatus.CANCELLED;
      ride.timestamps = { ...ride.timestamps, cancelledAt: new Date() };
      break;
    }

    case RideStatus.ACCEPTED: {
      if (ride.status !== RideStatus.REQUESTED) {
        throw new Error("Ride is not available for acceptance");
      }
      if (ride.driver) {
        throw new Error("This ride is already accepted by another driver");
      }
      ride.status = RideStatus.ACCEPTED;
      ride.driver = new Types.ObjectId(userId);
      ride.timestamps = { ...ride.timestamps, acceptedAt: new Date() };
      break;
    }

    case RideStatus.REJECTED: {
      if (ride.status !== RideStatus.REQUESTED) {
        throw new Error("Ride is not available for rejection");
      }
      if (ride.driver) {
        throw new Error("This ride is already handled by another driver");
      }
      ride.status = RideStatus.REJECTED;
      ride.driver = new Types.ObjectId(userId);
      ride.timestamps = { ...ride.timestamps, rejectedAt: new Date() };
      break;
    }

    case RideStatus.PICKED_UP:
    case RideStatus.IN_TRANSIT:
    case RideStatus.COMPLETED: {
      if (!ride.driver || ride.driver.toString() !== userId) {
        throw new Error(
          "Unauthorized: Only the assigned driver can update this ride"
        );
      }

      const allowedTransitions: Partial<Record<RideStatus, RideStatus[]>> = {
        [RideStatus.PICKED_UP]: [RideStatus.ACCEPTED],
        [RideStatus.IN_TRANSIT]: [RideStatus.PICKED_UP],
        [RideStatus.COMPLETED]: [RideStatus.IN_TRANSIT],
      };

      const validPrevStatuses = allowedTransitions[status] || [];
      if (!validPrevStatuses.includes(ride.status)) {
        throw new Error(
          `Cannot mark ride as ${status} from current status: ${ride.status}`
        );
      }

      ride.status = status;

      const timestampsMap: Partial<Record<RideStatus, string>> = {
        [RideStatus.PICKED_UP]: "pickedUpAt",
        [RideStatus.IN_TRANSIT]: "inTransitAt",
        [RideStatus.COMPLETED]: "completedAt",
      };
      const timestampField = timestampsMap[status];
      if (timestampField) {
        ride.timestamps = { ...ride.timestamps, [timestampField]: new Date() };
      }
      break;
    }

    default:
      throw new Error("Invalid status provided");
  }

  await ride.save();
  return ride;
};

const getRidesByUser = async (userId: string) => {
  const rides = await Ride.find({ rider: userId });
  return rides;
};

const getAllRides = async () => {
  return Ride.find().sort({ createdAt: -1 });
};

const getRideById = async (rideId: string) => {
  return Ride.findById(rideId);
};

export const RideService = {
  createRide,
  updateRideStatus,
  getRidesByUser,
  getAllRides,
  getRideById,
};
