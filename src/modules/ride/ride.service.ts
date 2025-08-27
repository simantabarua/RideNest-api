import { Types } from "mongoose";
import { IRideRequest, IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";
import User from "../user/user.model";
import { DriverInfo } from "../driver/driver.model";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { Payment } from "../payment/payment.model";
import { PaymentMethod, PaymentStatus } from "../payment/payment.interface";
import { Role } from "../user/user.interface";
import RiderInfo from "../rider/rider.info.model";

const ensureUserIsActive = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user || user.isSuspend) {
    throw new AppError(
      "Access denied. Your account is suspended.",
      StatusCodes.FORBIDDEN
    );
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

const createRide = async (data: IRideRequest, riderId: string) => {
  const activeRide = await Ride.findOne({
    rider: riderId,
    status: {
      $nin: [RideStatus.COMPLETED, RideStatus.CANCELLED, RideStatus.REJECTED],
    },
  });

  if (activeRide) {
    throw new AppError(
      "You have an ongoing ride. Please complete or cancel it before requesting a new one.",
      StatusCodes.BAD_REQUEST
    );
  }

  return Ride.create({
    ...data,
    rider: riderId,
    status: RideStatus.REQUESTED,
    timestamps: { requestedAt: new Date() },
  });
};

const getRidesByUser = async (userId: string) => {
  return Ride.find({ $or: [{ rider: userId }, { driver: userId }] })
    .sort({ createdAt: -1 })
    .populate("rider", "name email phone")
    .populate("driver", "name email phone vehicleInfo licenseNumber rating");
};

const getAllRides = async () => {
  return Ride.find()
    .sort({ createdAt: -1 })
    .populate("rider", "name email")
    .populate("driver", "name email phone vehicleInfo licenseNumber rating");
};
const getAllRequestedRides = async () => {
  return Ride.find({ status: RideStatus.REQUESTED })
    .sort({ createdAt: -1 })
    .populate("rider", "name email")
    .populate("driver", "name email");
};
const getRideById = async (rideId: string) => {
  return Ride.findById(rideId)
    .populate("rider", "name email")
    .populate("driver", "name email");
};

const getActiveRideByDriver = async (driverId: string) => {
  return Ride.find({
    driver: driverId,
    status: {
      $in: [RideStatus.ACCEPTED, RideStatus.PICKED_UP, RideStatus.IN_TRANSIT],
    },
  })
    .sort({ createdAt: -1 })
    .populate("rider", "name email")
    .populate("driver", "name email");
};

const getActiveRideByRider = async (riderId: string) => {
  return Ride.find({
    rider: riderId,
    status: {
      $in: [
        RideStatus.REQUESTED,
        RideStatus.ACCEPTED,
        RideStatus.PICKED_UP,
        RideStatus.IN_TRANSIT,
      ],
    },
  })
    .sort({ createdAt: -1 })
    .populate("rider", "name email")
    .populate("driver", "name email");
};

const cancelRide = async (
  rideId: string,
  userId: string,
  options: { reason: string; cancelBy: Role }
) => {
  await ensureUserIsActive(userId);

  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError("Ride not found", StatusCodes.NOT_FOUND);

  if (ride.status === RideStatus.CANCELLED) {
    throw new AppError("Ride is already cancelled", StatusCodes.BAD_REQUEST);
  }

  if (options.cancelBy === Role.RIDER) {
    if (ride.rider.toString() !== userId) {
      throw new AppError(
        "Only the rider can cancel this ride",
        StatusCodes.FORBIDDEN
      );
    }
  } else if (options.cancelBy === Role.DRIVER) {
    if (ride.driver?.toString() !== userId) {
      throw new AppError(
        "Only the assigned driver can cancel this ride",
        StatusCodes.FORBIDDEN
      );
    }
  }

  ride.status = RideStatus.CANCELLED;
  ride.cancellation = {
    reason: options.reason,
    cancelledBy: options.cancelBy,
  };
  ride.timestamps = {
    ...ride.timestamps,
    cancelledAt: new Date(),
  };

  await ride.save();

  await RiderInfo.findOneAndUpdate(
    { rider: ride.rider },
    {
      $inc: {
        cancelledRides: 1,
        totalRides: 1,
      },
    },
    { upsert: true, new: true }
  );

  return getRideById(ride._id.toString());
};

const acceptRide = async (rideId: string, driverId: string) => {
  const isDriverApproved = await User.findOne({
    _id: driverId,
    isApproved: true,
  });
  if (!isDriverApproved) {
    throw new AppError(
      "Your driver account is not approved. You cannot accept rides at this time. Please contact the administrator for assistance.",
      StatusCodes.BAD_REQUEST
    );
  }
  await ensureUserIsActive(driverId);
  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError("Ride not found", StatusCodes.NOT_FOUND);

  if (ride.status !== RideStatus.REQUESTED)
    throw new AppError(
      "Ride is not available for acceptance",
      StatusCodes.BAD_REQUEST
    );

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

const rejectRide = async (rideId: string, driverId: string) => {
  await ensureUserIsActive(driverId);

  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError("Ride not found", StatusCodes.NOT_FOUND);

  if (ride.status !== RideStatus.REQUESTED)
    throw new AppError(
      "Ride is not available for rejection",
      StatusCodes.BAD_REQUEST
    );

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

// complete ride
const completeRide = async (rideId: string, driverId: string) => {
  const updatedRide = await progressRideStatus(
    rideId,
    driverId,
    RideStatus.COMPLETED
  );

  if (!updatedRide) {
    throw new AppError("Ride not found after update", StatusCodes.NOT_FOUND);
  }

  const payment = await Payment.create({
    ride: updatedRide._id,
    paymentStatus: PaymentStatus.PENDING,
    paymentMethod: PaymentMethod.CASH,
    amount: updatedRide.totalFare || 0,
    currency: "BDT",
    initiatedAt: new Date(),
  });

  updatedRide.payment = payment._id as Types.ObjectId;
  const totalFare = updatedRide.totalFare || 0;

  await updatedRide.save();

  await DriverInfo.findOneAndUpdate(
    { driver: driverId },
    {
      $inc: {
        completedRides: 1,
        earnings: totalFare,
      },
      $set: { isAvailable: true },
    }
  );

  return Ride.findById(updatedRide._id)
    .populate("rider", "name email")
    .populate("driver", "name email")
    .populate("payment")
    .exec();
};

const progressRideStatus = async (
  rideId: string,
  driverId: string,
  newStatus: RideStatus
) => {
  await ensureUserIsActive(driverId);

  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError("Ride not found", StatusCodes.NOT_FOUND);

  if (!ride.driver || ride.driver.toString() !== driverId)
    throw new AppError(
      "Only assigned driver can update this ride",
      StatusCodes.FORBIDDEN
    );

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
    throw new AppError(
      `Cannot move from ${ride.status} to ${newStatus}`,
      StatusCodes.BAD_REQUEST
    );
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

const getRiderRidesStats = async (riderId: string) => {
  if (!Types.ObjectId.isValid(riderId)) {
    throw new Error("Invalid rider ID");
  }

  const stats = await Ride.aggregate([
    { $match: { rider: new Types.ObjectId(riderId) } },
    {
      $group: {
        _id: "$rider",
        totalRides: { $sum: 1 },
        totalCompletedRides: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
        totalCancelledRides: {
          $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
        },
        totalSpent: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$fare", 0] },
        },
      },
    },
  ]);

  const result = stats[0] || {
    totalRides: 0,
    totalCompletedRides: 0,
    totalCancelledRides: 0,
    totalSpent: 0,
  };

  return [
    { title: "Total Rides", value: result.totalRides.toString() },
    { title: "Completed Rides", value: result.totalCompletedRides.toString() },
    { title: "Cancelled Rides", value: result.totalCancelledRides.toString() },
    { title: "Total Spent", value: result.totalSpent.toString() },
  ];
};

export const getDriverRidesStats = async (driverId: string) => {
  if (!Types.ObjectId.isValid(driverId)) {
    throw new Error("Invalid driver ID");
  }
  const stats = await Ride.aggregate([
    { $match: { driver: new Types.ObjectId(driverId) } },
    {
      $group: {
        _id: "$driver",
        totalRides: { $sum: 1 },
        totalCompletedRides: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
        totalEarnings: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$totalFare", 0] },
        },
      },
    },
  ]);
  const ratings = await DriverInfo.aggregate([
    { $match: { driver: new Types.ObjectId(driverId) } },
    {
      $group: {
        _id: "$driver",
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  const result = {
    totalRides: stats[0]?.totalRides || 0,
    totalCompletedRides: stats[0]?.totalCompletedRides || 0,
    totalEarnings: stats[0]?.totalEarnings || 0,
    avgRating: ratings[0]?.avgRating || 0,
  };

  return [
    { title: "Total Rides", value: result.totalRides.toString() },
    { title: "Completed Rides", value: result.totalCompletedRides.toString() },
    { title: "Total Earnings", value: result.totalEarnings.toString() },
    { title: "Average Rating", value: result.avgRating.toFixed(1) },
  ];
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
  getAllRequestedRides,
  completeRide,
  getActiveRideByDriver,
  getActiveRideByRider,
  getRiderRidesStats,
  getDriverRidesStats,
};
