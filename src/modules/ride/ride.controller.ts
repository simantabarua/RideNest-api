import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { RideService } from "./ride.service";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../user/user.interface";

const withUser = (req: Request) => (req.user as JwtPayload).id;

const requestRide = catchAsync(async (req: Request, res: Response) => {
  const ride = await RideService.createRide(req.body, withUser(req));
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Ride requested",
    data: ride,
  });
});

const getMyRides = catchAsync(async (req: Request, res: Response) => {
  const rides = await RideService.getRidesByUser(withUser(req));
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rides retrieved",
    data: rides,
  });
});

const getAllRides = catchAsync(async (req: Request, res: Response) => {
  const rides = await RideService.getAllRides();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All rides retrieved",
    data: rides,
  });
});
const getAllRequestedRides = catchAsync(
  async (_req: Request, res: Response) => {
    const rides = await RideService.getAllRequestedRides();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All requested retrieved",
      data: rides,
    });
  }
);
const getActiveRideByDriver = catchAsync(
  async (req: Request, res: Response) => {
    const rides = await RideService.getActiveRideByDriver(withUser(req));
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All active retrieved",
      data: rides,
    });
  }
);
const getActiveRideByRider = catchAsync(async (req: Request, res: Response) => {
  const rides = await RideService.getActiveRideByRider(withUser(req));
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All active retrieved",
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

const transition = (
  fn: (rideId: string, userId: string) => Promise<unknown>,
  msg: string
) =>
  catchAsync(async (req: Request, res: Response) => {
    const ride = await fn(req.params.id, withUser(req));
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: msg,
      data: ride,
    });
  });

const cancelRide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rideId = req.params.id;
    const decodedToken = req.user as JwtPayload;
    const userId = decodedToken.id;
    const { reason } = req.body;
    const cancelBy = decodedToken.role;
    if (!Object.values(Role).includes(cancelBy)) {
      return res.status(400).json({ message: "Invalid cancelBy role" });
    }
    const updatedRide = await RideService.cancelRide(rideId, userId, {
      reason,
      cancelBy,
    });

    return res.status(200).json({
      message: "Ride cancelled",
      data: updatedRide,
    });
  } catch (error) {
    next(error);
  }
};

const getRiderRidesStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await RideService.getRiderRidesStats(withUser(req));
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Ride stats retrieved",
    data: stats,
  });
});
const getDriverRidesStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await RideService.getDriverRidesStats(withUser(req));
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Ride stats retrieved",
    data: stats,
  });
})
const acceptRide = transition(RideService.acceptRide, "Ride accepted");
const rejectRide = transition(RideService.rejectRide, "Ride rejected");
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
  getAllRequestedRides,
  getActiveRideByDriver,
  getActiveRideByRider,
  getRiderRidesStats,
  getDriverRidesStats
};
