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
    if (driver && typeof driver.toObject === "function") {
      const driverData = driver.toObject();
      delete driverData.password;
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Availability updated",
        data: driverData,
      });
    } else {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Driver not found",
        data: null,
      });
    }
  }),

  getProfile: catchAsync(async (req: Request, res: Response) => {
    const { id: userId } = req.user as JwtPayload;

    const driver = await DriverService.getDriverProfile(userId);
    if (driver && typeof driver.toObject === "function") {
      const driverData = driver.toObject();
      delete driverData.password;
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Driver profile fetched",
        data: driverData,
      });
    } else {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Driver not found",
        data: null,
      });
    }
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
