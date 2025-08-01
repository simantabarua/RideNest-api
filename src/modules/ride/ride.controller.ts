import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { RideService } from "./ride.service";
import { JwtPayload } from "jsonwebtoken";

const withUser = (req: Request) => (req.user as JwtPayload).id;

const requestRide = catchAsync(async (req: Request, res: Response) => {
  const ride = await RideService.createRide(req.body, withUser(req));
  sendResponse(res, { statusCode: 201, success: true, message: "Ride requested", data: ride });
});

const getMyRides = catchAsync(async (req: Request, res: Response) => {
  const rides = await RideService.getRidesByUser(withUser(req));
  sendResponse(res, { statusCode: 200, success: true, message: "Rides retrieved", data: rides });
});

const getAllRides = catchAsync(async (_req: Request, res: Response) => {
  const rides = await RideService.getAllRides();
  sendResponse(res, { statusCode: 200, success: true, message: "All rides retrieved", data: rides });
});

const getRideById = catchAsync(async (req: Request, res: Response) => {
  const ride = await RideService.getRideById(req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: "Ride retrieved", data: ride });
});

const transition = (fn: (rideId: string, userId: string) => Promise<unknown>, msg: string) =>
  catchAsync(async (req: Request, res: Response) => {
    const ride = await fn(req.params.id, withUser(req));
    sendResponse(res, { statusCode: 200, success: true, message: msg, data: ride });
  });

const acceptRide = transition(RideService.acceptRide, "Ride accepted");
const rejectRide = transition(RideService.rejectRide, "Ride rejected");
const cancelRide = transition(RideService.cancelRide, "Ride cancelled");
const pickupRide = transition(RideService.pickupRide, "Ride picked up");
const startRide = transition(RideService.startRide, "Ride in transit");
const completeRide = transition(RideService.completeRide, "Ride completed");

export const RideController = {
  requestRide,
  getMyRides,
  getAllRides,
  getRideById,
  acceptRide,
  rejectRide,
  cancelRide,
  pickupRide,
  startRide,
  completeRide,
};
