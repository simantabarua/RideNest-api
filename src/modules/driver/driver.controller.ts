import { Request, Response } from "express";
import { DriverService } from "./driver.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

export const DriverController = {
  setAvailability: catchAsync(async (req: Request, res: Response) => {
    const { id: userId } = req.user as JwtPayload;

    const driver = await DriverService.setAvailability(
      userId,
      req.body.isOnline
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Availability updated",
      data: driver,
    });
  }),

  getProfile: catchAsync(async (req: Request, res: Response) => {
    const { id: userId } = req.user as JwtPayload;
    const driver = await DriverService.getDriverProfile(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Driver profile fetched",
      data: driver,
    });
  }),

  getEarnings: catchAsync(async (req: Request, res: Response) => {
    const { id: userId } = req.user as JwtPayload;

    const total = await DriverService.getEarnings(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Earnings fetched",
      data: { totalEarnings: total },
    });
  }),
};
