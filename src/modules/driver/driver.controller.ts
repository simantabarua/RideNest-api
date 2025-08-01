import { Request, Response } from "express";
import { DriverService } from "./driver.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

export const DriverController = {
  setAvailability: catchAsync(async (req: Request, res: Response) => {
    const { id: userId } = req.user as JwtPayload;
    const { isAvailable } = req.body;
    if (typeof isAvailable !== "boolean") {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "`isAvailable` must be a boolean.",
        data: null,
      });
    }
    const updatedDriver = await DriverService.setAvailability(
      userId,
      isAvailable
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Driver availability updated",
      data: updatedDriver,
    });
  }),

  getProfile: catchAsync(async (req: Request, res: Response) => {
    const { id: userId } = req.user as JwtPayload;
    const driver = await DriverService.getDriverProfile(userId);
    if (!driver) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Driver not found",
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Driver profile fetched",
      data: driver,
    });
  }),

  getEarnings: catchAsync(async (req: Request, res: Response) => {
    const { id: userId } = req.user as JwtPayload;
    const totalEarnings = await DriverService.getEarnings(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Driver earnings fetched",
      data: { totalEarnings },
    });
  }),
};
