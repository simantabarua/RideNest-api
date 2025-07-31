import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { availabilitySchema, rideStatusSchema } from "./driver.validation";
import * as DriverService from "./driver.service";
import { JwtPayload } from "jsonwebtoken";
import { RideStatus } from "../ride/ride.interface";

const getDriverId = (req: Request): string => {
  const user = req.user as JwtPayload | undefined;
  if (!user || !user.id) throw new Error("Unauthorized access: no user ID");
  return user.id;
};

const updateAvailability = catchAsync(async (req: Request, res: Response) => {
  const parsed = availabilitySchema.parse(req.body);
  const driverId = getDriverId(req);
  const driver = await DriverService.setAvailability(driverId, parsed.isOnline);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Availability updated",
    data: driver,
  });
});

const updateRideStatus = catchAsync(async (req: Request, res: Response) => {
  const parsed = rideStatusSchema.parse(req.body);
  const status = parsed.status as RideStatus;
  const driverId = getDriverId(req);
  const ride = await DriverService.updateRideStatus(
    req.params.id,
    driverId,
    status
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Ride status updated",
    data: ride,
  });
});

const getEarnings = catchAsync(async (req: Request, res: Response) => {
  const driverId = getDriverId(req);
  const earnings = await DriverService.getDriverEarnings(driverId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Driver earnings retrieved",
    data: earnings,
  });
});

export const DriverController = {
  updateAvailability,
  updateRideStatus,
  getEarnings,
};
