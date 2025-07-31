import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { RideService } from "./ride.service";
import { JwtPayload } from "jsonwebtoken";
import { RideStatus } from "./ride.interface";

const requestRide = catchAsync(async (req: Request, res: Response) => {
  const { id: riderId } = req.user as JwtPayload;
  const ride = await RideService.createRide(req.body, riderId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Ride requested",
    data: ride,
  });
});

const updateRideStatus = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const rideId = req.params.id;
  const status = req.query.status as string;

  if (!status) {
    throw new Error("Status query parameter is required");
  }

  const ride = await RideService.updateRideStatus(
    rideId,
    userId,
    status as RideStatus
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Ride status updated to ${status}`,
    data: ride,
  });
});

const getMyRides = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const rides = await RideService.getRidesByUser(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rides retrieved successfully",
    data: rides,
  });
});

const getAllRides = catchAsync(async (_req: Request, res: Response) => {
  const rides = await RideService.getAllRides();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All rides retrieved",
    data: rides,
  });
});

const getRideById = catchAsync(async (req: Request, res: Response) => {
  const ride = await RideService.getRideById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Ride retrieved",
    data: ride,
  });
});

export const RideController = {
  requestRide,
  updateRideStatus,
  getMyRides,
  getAllRides,
  getRideById,
};
