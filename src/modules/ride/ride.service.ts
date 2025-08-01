import { Types } from "mongoose";
import { IRideRequest, IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";
import User from "../user/user.model";
import { DriverInfo } from "../driver/driver.model";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";

// Utility
const ensureUserIsActive = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user || user.isBlocked) {
    throw new AppError("Access denied. Your account is suspended.", StatusCodes.FORBIDDEN);
  }
};

const ensureDriverHasNoActiveRide = async (driverId: string) => {
  const activeRide = await Ride.findOne({
    driver: driverId,
    status: {
      $in: [RideStatus.ACCEPTED, RideStatus.PICKED_UP, RideStatus.IN_TRANSIT],
    },
  });
  if (activeRide) {
    throw new AppError(
      "You cannot accept another ride until your current one is completed.",
      StatusCodes.BAD_REQUEST
    );
  }
};

// Create Ride
const createRide = async (data: IRideRequest, riderId: string) => {
  return Ride.create({
    ...data,
    rider: riderId,
    status: RideStatus.REQUESTED,
    timestamps: { requestedAt: new Date() },
  });
};

//  Get Rides
const getRidesByUser = async (userId: string) => {
  return Ride.find({ $or: [{ rider: userId }, { driver: userId }] })
    .sort({ createdAt: -1 })
    .populate("rider", "name email")
    .populate("driver", "name email");
};

const getAllRides = async () => {
  return Ride.find()
    .sort({ createdAt: -1 })
    .populate("rider", "name email")
    .populate("driver", "name email");
};

const getRideById = async (rideId: string) => {
  return Ride.findById(rideId)
    .populate("rider", "name email")
    .populate("driver", "name email");
};

// Cancel Ride
const cancelRide = async (rideId: string, userId: string) => {
  await ensureUserIsActive(userId);

  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError("Ride not found", StatusCodes.NOT_FOUND);

  if (ride.rider.toString() !== userId)
    throw new AppError("Only the rider can cancel this ride", StatusCodes.FORBIDDEN);

  if (ride.status !== RideStatus.REQUESTED)
    throw new AppError("Cannot cancel ride after it is accepted", StatusCodes.BAD_REQUEST);

  ride.status = RideStatus.CANCELLED;
  ride.timestamps.cancelledAt = new Date();
  await ride.save();

  return getRideById(ride._id.toString());
};

// Accept Ride
const acceptRide = async (rideId: string, driverId: string) => {
  await ensureUserIsActive(driverId);

  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError("Ride not found", StatusCodes.NOT_FOUND);

  if (ride.status !== RideStatus.REQUESTED)
    throw new AppError("Ride is not available for acceptance", StatusCodes.BAD_REQUEST);

  if (ride.driver)
    throw new AppError("Ride already accepted", StatusCodes.BAD_REQUEST);

  await ensureDriverHasNoActiveRide(driverId);

  ride.status = RideStatus.ACCEPTED;
  ride.driver = new Types.ObjectId(driverId);
  ride.timestamps.acceptedAt = new Date();
  await ride.save();

  await DriverInfo.findOneAndUpdate(
    { driver: driverId },
    { $set: { isAvailable: false } }
  );

  return getRideById(ride._id.toString());
};

// Reject Ride
const rejectRide = async (rideId: string, driverId: string) => {
  await ensureUserIsActive(driverId);

  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError("Ride not found", StatusCodes.NOT_FOUND);

  if (ride.status !== RideStatus.REQUESTED)
    throw new AppError("Ride is not available for rejection", StatusCodes.BAD_REQUEST);

  if (ride.driver)
    throw new AppError("Ride already handled", StatusCodes.BAD_REQUEST);

  ride.status = RideStatus.REJECTED;
  ride.driver = new Types.ObjectId(driverId);
  ride.timestamps.rejectedAt = new Date();
  await ride.save();

  return getRideById(ride._id.toString());
};

// Pick Up Ride
const pickupRide = async (rideId: string, driverId: string) => {
  return progressRideStatus(rideId, driverId, RideStatus.PICKED_UP);
};

// In-transit Ride
const startRide = async (rideId: string, driverId: string) => {
  return progressRideStatus(rideId, driverId, RideStatus.IN_TRANSIT);
};

//  Complete Ride
const completeRide = async (rideId: string, driverId: string) => {
  const updatedRide = await progressRideStatus(
    rideId,
    driverId,
    RideStatus.COMPLETED
  );

  await DriverInfo.findOneAndUpdate(
    { driver: driverId },
    {
      $inc: { completedRides: 1 },
      $set: { isAvailable: true },
    }
  );

  return updatedRide;
};

//  Progress ride helper
const progressRideStatus = async (
  rideId: string,
  driverId: string,
  newStatus: RideStatus
) => {
  await ensureUserIsActive(driverId);

  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError("Ride not found", StatusCodes.NOT_FOUND);

  if (!ride.driver || ride.driver.toString() !== driverId)
    throw new AppError("Only assigned driver can update this ride", StatusCodes.FORBIDDEN);

  const validTransitions: Record<RideStatus, RideStatus[]> = {
    [RideStatus.PICKED_UP]: [RideStatus.ACCEPTED],
    [RideStatus.IN_TRANSIT]: [RideStatus.PICKED_UP],
    [RideStatus.COMPLETED]: [RideStatus.IN_TRANSIT],
    [RideStatus.ACCEPTED]: [],
    [RideStatus.REQUESTED]: [],
    [RideStatus.REJECTED]: [],
    [RideStatus.CANCELLED]: [],
  };

  const allowedPrev = validTransitions[newStatus];
  if (!allowedPrev.includes(ride.status)) {
    throw new AppError(`Cannot move from ${ride.status} to ${newStatus}`, StatusCodes.BAD_REQUEST);
  }

  ride.status = newStatus;
  const timestampsMap: Record<RideStatus, keyof IRide["timestamps"]> = {
    [RideStatus.PICKED_UP]: "pickedUpAt",
    [RideStatus.IN_TRANSIT]: "inTransitAt",
    [RideStatus.COMPLETED]: "completedAt",
    [RideStatus.ACCEPTED]: "acceptedAt",
    [RideStatus.REQUESTED]: "requestedAt",
    [RideStatus.REJECTED]: "rejectedAt",
    [RideStatus.CANCELLED]: "cancelledAt",
  };

  const timestampField = timestampsMap[newStatus];
  if (timestampField) {
    ride.timestamps[timestampField] = new Date();
  }

  await ride.save();
  return getRideById(ride._id.toString());
};

export const RideService = {
  createRide,
  getRidesByUser,
  getAllRides,
  getRideById,
  cancelRide,
  acceptRide,
  rejectRide,
  pickupRide,
  startRide,
  completeRide,
};
