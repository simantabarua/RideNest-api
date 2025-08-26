import { Request, Response } from "express";
import { DriverService } from "./driver.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const setAvailability = catchAsync(async (req: Request, res: Response) => {
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
});
const isAvailable = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user as JwtPayload;
  const isAvailable = await DriverService.isAvailable(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Driver availability fetched",
    data: isAvailable,
  });
});

export const DriverController = {
  setAvailability,
  isAvailable,
};
